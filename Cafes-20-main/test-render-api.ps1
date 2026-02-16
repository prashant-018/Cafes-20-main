# PowerShell script to test Render API deployment

Write-Host "`n🧪 Testing Render API Deployment" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

$baseUrl = "https://cafes-20-main.onrender.com"

# Test 1: Health Check
Write-Host "Test 1: Health Check" -ForegroundColor Yellow
Write-Host "URL: $baseUrl/api/health" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/health" -Method Get -ErrorAction Stop
    Write-Host "✅ SUCCESS" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json -Depth 3)" -ForegroundColor Green
} catch {
    Write-Host "❌ FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n---`n"

# Test 2: Register User
Write-Host "Test 2: Register New User" -ForegroundColor Yellow
Write-Host "URL: $baseUrl/api/auth/register" -ForegroundColor Gray
$timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$registerBody = @{
    name = "Test User"
    email = "test$timestamp@example.com"
    password = "test123456"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $registerBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "✅ SUCCESS" -ForegroundColor Green
    Write-Host "User created: $($response.data.user.email)" -ForegroundColor Green
    $token = $response.data.token
    $testEmail = $response.data.user.email
} catch {
    Write-Host "❌ FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

Write-Host "`n---`n"

# Test 3: Login with created user
if ($testEmail) {
    Write-Host "Test 3: Login with Created User" -ForegroundColor Yellow
    Write-Host "URL: $baseUrl/api/auth/login" -ForegroundColor Gray
    $loginBody = @{
        email = $testEmail
        password = "test123456"
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json" -ErrorAction Stop
        Write-Host "✅ SUCCESS" -ForegroundColor Green
        Write-Host "Login successful for: $($response.data.user.email)" -ForegroundColor Green
    } catch {
        Write-Host "❌ FAILED" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.ErrorDetails.Message) {
            Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "Test 3: Skipped (registration failed)" -ForegroundColor Yellow
}

Write-Host "`n---`n"

# Test 4: Admin Login
Write-Host "Test 4: Admin Login" -ForegroundColor Yellow
Write-Host "URL: $baseUrl/api/auth/admin/login" -ForegroundColor Gray
$adminLoginBody = @{
    email = "admin@gmail.com"
    password = "prashant123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/admin/login" -Method Post -Body $adminLoginBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "✅ SUCCESS" -ForegroundColor Green
    Write-Host "Admin login successful" -ForegroundColor Green
} catch {
    Write-Host "❌ FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "🏁 Testing Complete`n" -ForegroundColor Cyan
