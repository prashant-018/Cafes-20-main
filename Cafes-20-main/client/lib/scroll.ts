// Navbar height constant for scroll calculations
const NAVBAR_HEIGHT = 88;

/**
 * Smoothly scrolls to a section by ID with navbar offset
 * @param sectionId - The ID of the section to scroll to
 */
export const scrollToSection = (sectionId: string): void => {
  const element = document.getElementById(sectionId);
  if (element) {
    const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
    const scrollPosition = elementTop - NAVBAR_HEIGHT;

    window.scrollTo({
      top: scrollPosition,
      behavior: "smooth"
    });
  }
};