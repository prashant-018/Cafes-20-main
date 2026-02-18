import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Upload,
  X,
  Loader2,
  Leaf,
  Save,
  Image as ImageIcon
} from "lucide-react";

export interface MenuItemData {
  id?: string;
  name: string;
  category: string;
  description: string;
  isVeg: boolean;
  pricing: {
    small?: number;
    medium?: number;
    large?: number;
    single?: number;
  };
  image: string;
  isAvailable: boolean;
  isPopular?: boolean;
}

interface MenuItemFormProps {
  onSubmit: (item: MenuItemData) => Promise<void>;
  initialData?: MenuItemData;
  isEditing?: boolean;
}

const CATEGORIES = [
  "Classic Pizzas",
  "Delight Pizzas",
  "Premium Pizzas",
  "Burgers",
  "Wraps",
  "Pasta",
  "Garlic Bread",
  "Sides",
  "Shakes",
  "Coffee",
  "Desserts",
  "Dips"
];

export default function MenuItemForm({ onSubmit, initialData, isEditing = false }: MenuItemFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(initialData?.image || "");
  const [dragActive, setDragActive] = useState(false);

  const [formData, setFormData] = useState<MenuItemData>(
    initialData || {
      name: "",
      category: "",
      description: "",
      isVeg: true,
      pricing: {},
      image: "",
      isAvailable: true,
      isPopular: false
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle form field changes
  const updateField = (field: keyof MenuItemData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle pricing changes
  const updatePricing = (size: string, value: string) => {
    const numValue = value === "" ? undefined : parseFloat(value);
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [size]: numValue
      }
    }));
  };

  // Handle image upload
  const handleImageUpload = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: "Image size must be less than 5MB" }));
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrors(prev => ({ ...prev, image: "Only JPG, PNG, and WebP formats are supported" }));
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setFormData(prev => ({ ...prev, image: result }));
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.image;
        return newErrors;
      });
    };
    reader.readAsDataURL(file);
  };

  // Handle file input change
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Food name is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.image) {
      newErrors.image = "Image is required";
    }

    // Check if at least one price is provided
    const hasPricing = Object.values(formData.pricing).some(price => price !== undefined && price > 0);
    if (!hasPricing) {
      newErrors.pricing = "At least one price must be provided";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
      // Reset form if not editing
      if (!isEditing) {
        setFormData({
          name: "",
          category: "",
          description: "",
          isVeg: true,
          pricing: {},
          image: "",
          isAvailable: true,
          isPopular: false
        });
        setImagePreview("");
      }
    } catch (error) {
      console.error("Failed to submit form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-[#111111] border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white">
          <Plus className="w-5 h-5 text-red-500" />
          {isEditing ? "Edit Menu Item" : "Add New Menu Item"}
        </CardTitle>
        <CardDescription className="text-gray-400">
          {isEditing ? "Update the menu item details" : "Fill in the details to add a new item to your menu"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Food Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300 font-medium">
                Food Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                className={`bg-[#0a0a0a] border-gray-700 text-white h-11 focus:border-red-500 focus:ring-red-500/20 ${errors.name ? "border-red-500" : ""
                  }`}
                placeholder="e.g., Margherita Pizza"
              />
              {errors.name && (
                <p className="text-red-400 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-gray-300 font-medium">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => updateField("category", value)}
              >
                <SelectTrigger
                  className={`bg-[#0a0a0a] border-gray-700 text-white h-11 focus:border-red-500 focus:ring-red-500/20 ${errors.category ? "border-red-500" : ""
                    }`}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-gray-700">
                  {CATEGORIES.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="text-white hover:bg-gray-800 focus:bg-gray-800"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-red-400 text-sm">{errors.category}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300 font-medium">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              className={`bg-[#0a0a0a] border-gray-700 text-white min-h-[100px] focus:border-red-500 focus:ring-red-500/20 ${errors.description ? "border-red-500" : ""
                }`}
              placeholder="Describe the dish, ingredients, and what makes it special..."
            />
            {errors.description && (
              <p className="text-red-400 text-sm">{errors.description}</p>
            )}
          </div>

          {/* Toggles Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Veg/Non-Veg Toggle */}
            <div className="space-y-2">
              <Label className="text-gray-300 font-medium">Food Type</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={formData.isVeg ? "default" : "outline"}
                  onClick={() => updateField("isVeg", true)}
                  className={`flex-1 ${formData.isVeg
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "border-gray-700 text-gray-400 hover:bg-gray-800"
                    }`}
                >
                  <Leaf className="w-4 h-4 mr-2" />
                  Veg
                </Button>
                <Button
                  type="button"
                  variant={!formData.isVeg ? "default" : "outline"}
                  onClick={() => updateField("isVeg", false)}
                  className={`flex-1 ${!formData.isVeg
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "border-gray-700 text-gray-400 hover:bg-gray-800"
                    }`}
                >
                  Non-Veg
                </Button>
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="space-y-2">
              <Label className="text-gray-300 font-medium">Availability</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={formData.isAvailable ? "default" : "outline"}
                  onClick={() => updateField("isAvailable", true)}
                  className={`flex-1 ${formData.isAvailable
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "border-gray-700 text-gray-400 hover:bg-gray-800"
                    }`}
                >
                  Available
                </Button>
                <Button
                  type="button"
                  variant={!formData.isAvailable ? "default" : "outline"}
                  onClick={() => updateField("isAvailable", false)}
                  className={`flex-1 ${!formData.isAvailable
                    ? "bg-gray-600 hover:bg-gray-700 text-white"
                    : "border-gray-700 text-gray-400 hover:bg-gray-800"
                    }`}
                >
                  Out of Stock
                </Button>
              </div>
            </div>

            {/* Popular Toggle */}
            <div className="space-y-2">
              <Label className="text-gray-300 font-medium">Mark as Popular</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={formData.isPopular ? "default" : "outline"}
                  onClick={() => updateField("isPopular", !formData.isPopular)}
                  className={`flex-1 ${formData.isPopular
                    ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                    : "border-gray-700 text-gray-400 hover:bg-gray-800"
                    }`}
                >
                  ⭐ {formData.isPopular ? "Popular" : "Regular"}
                </Button>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300 font-medium">
                Pricing <span className="text-red-500">*</span>
              </Label>
              <p className="text-gray-500 text-sm mt-1">
                Add at least one price. Use size-based pricing for pizzas or single price for other items.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="small" className="text-gray-400 text-sm">Small (₹)</Label>
                <Input
                  id="small"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.pricing.small || ""}
                  onChange={(e) => updatePricing("small", e.target.value)}
                  className="bg-[#0a0a0a] border-gray-700 text-white h-11 focus:border-red-500 focus:ring-red-500/20"
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medium" className="text-gray-400 text-sm">Medium (₹)</Label>
                <Input
                  id="medium"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.pricing.medium || ""}
                  onChange={(e) => updatePricing("medium", e.target.value)}
                  className="bg-[#0a0a0a] border-gray-700 text-white h-11 focus:border-red-500 focus:ring-red-500/20"
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="large" className="text-gray-400 text-sm">Large (₹)</Label>
                <Input
                  id="large"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.pricing.large || ""}
                  onChange={(e) => updatePricing("large", e.target.value)}
                  className="bg-[#0a0a0a] border-gray-700 text-white h-11 focus:border-red-500 focus:ring-red-500/20"
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="single" className="text-gray-400 text-sm">Single Price (₹)</Label>
                <Input
                  id="single"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.pricing.single || ""}
                  onChange={(e) => updatePricing("single", e.target.value)}
                  className="bg-[#0a0a0a] border-gray-700 text-white h-11 focus:border-red-500 focus:ring-red-500/20"
                  placeholder="0"
                />
              </div>
            </div>
            {errors.pricing && (
              <p className="text-red-400 text-sm">{errors.pricing}</p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <Label className="text-gray-300 font-medium">
              Item Image <span className="text-red-500">*</span>
            </Label>

            {/* Image Preview */}
            {imagePreview && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-md mx-auto"
              >
                <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-700">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-600"
                    onClick={() => {
                      setImagePreview("");
                      setFormData(prev => ({ ...prev, image: "" }));
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Upload Area */}
            {!imagePreview && (
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer ${dragActive
                  ? "border-red-500 bg-red-500/5"
                  : errors.image
                    ? "border-red-500 bg-red-500/5"
                    : "border-gray-600 hover:border-gray-500 bg-[#0a0a0a]"
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                <div className="space-y-4">
                  <div
                    className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-colors duration-300 ${dragActive ? "bg-red-500/20" : "bg-gray-700"
                      }`}
                  >
                    <Upload
                      className={`w-8 h-8 transition-colors duration-300 ${dragActive ? "text-red-400" : "text-gray-400"
                        }`}
                    />
                  </div>

                  <div>
                    <p className="text-white font-medium mb-2">
                      {dragActive ? "Drop image here" : "Drag & drop image here"}
                    </p>
                    <p className="text-gray-400 text-sm mb-4">or click to browse</p>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-red-600/50 text-red-400 hover:bg-red-600/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Select Image
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {errors.image && (
              <p className="text-red-400 text-sm">{errors.image}</p>
            )}

            <div className="flex items-start gap-2 p-3 bg-blue-600/10 rounded-lg border border-blue-600/20">
              <Upload className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-blue-400 font-medium">Image Guidelines</p>
                <ul className="text-gray-400 mt-1 space-y-1">
                  <li>• Maximum file size: 5MB</li>
                  <li>• Supported formats: JPG, PNG, WebP</li>
                  <li>• Recommended size: 800x800px (square)</li>
                  <li>• Use high-quality, well-lit food photos</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white h-12 text-base font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {isEditing ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  {isEditing ? "Update Item" : "Add to Menu"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
