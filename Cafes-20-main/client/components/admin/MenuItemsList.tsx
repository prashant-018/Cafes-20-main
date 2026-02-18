import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Trash2,
  Eye,
  Leaf,
  AlertCircle,
  CheckCircle,
  MenuIcon
} from "lucide-react";
import { MenuItemData } from "./MenuItemForm";

interface MenuItemsListProps {
  items: MenuItemData[];
  onEdit: (item: MenuItemData) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string, isAvailable: boolean) => void;
}

export default function MenuItemsList({
  items,
  onEdit,
  onDelete,
  onToggleAvailability
}: MenuItemsListProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Format price display
  const formatPrice = (pricing: MenuItemData['pricing']) => {
    const prices = [];
    if (pricing.small) prices.push(`S: ₹${pricing.small}`);
    if (pricing.medium) prices.push(`M: ₹${pricing.medium}`);
    if (pricing.large) prices.push(`L: ₹${pricing.large}`);
    if (pricing.single) prices.push(`₹${pricing.single}`);
    return prices.join(" | ");
  };

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItemData[]>);

  return (
    <>
      <Card className="bg-[#111111] border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <MenuIcon className="w-5 h-5 text-red-500" />
            Menu Items ({items.length})
          </CardTitle>
          <CardDescription className="text-gray-400">
            Manage your menu items, edit details, and control availability
          </CardDescription>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <MenuIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400 mb-2">No menu items added yet</p>
              <p className="text-gray-500 text-sm">Add your first menu item using the form above</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedItems).map(([category, categoryItems]) => (
                <div key={category} className="space-y-4">
                  {/* Category Header */}
                  <div className="flex items-center gap-3 pb-2 border-b border-gray-800">
                    <h3 className="text-lg font-semibold text-white">{category}</h3>
                    <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                      {categoryItems.length} item{categoryItems.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>

                  {/* Items Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {categoryItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`bg-[#0a0a0a] rounded-lg border transition-all duration-300 overflow-hidden ${item.isAvailable
                          ? "border-gray-700 hover:border-gray-600"
                          : "border-gray-800 opacity-60"
                          }`}
                      >
                        <div className="flex gap-4 p-4">
                          {/* Image */}
                          <div
                            className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer group"
                            onClick={() => setSelectedImage(item.image)}
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <Eye className="w-6 h-6 text-white" />
                            </div>

                            {/* Badges */}
                            <div className="absolute top-2 left-2 flex flex-col gap-1">
                              {item.isVeg && (
                                <Badge className="bg-green-600 border-green-500 text-white px-1.5 py-0.5 text-xs">
                                  <Leaf className="w-3 h-3" />
                                </Badge>
                              )}
                              {item.isPopular && (
                                <Badge className="bg-yellow-600 border-yellow-500 text-white px-1.5 py-0.5 text-xs">
                                  ⭐
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h4 className="text-white font-semibold text-base line-clamp-1">
                                  {item.name}
                                </h4>
                                <Badge
                                  variant={item.isAvailable ? "default" : "secondary"}
                                  className={`flex-shrink-0 ${item.isAvailable
                                    ? "bg-green-600/20 text-green-400 border-green-600/30"
                                    : "bg-gray-600/20 text-gray-400 border-gray-600/30"
                                    }`}
                                >
                                  {item.isAvailable ? (
                                    <>
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Available
                                    </>
                                  ) : (
                                    <>
                                      <AlertCircle className="w-3 h-3 mr-1" />
                                      Out of Stock
                                    </>
                                  )}
                                </Badge>
                              </div>

                              <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                                {item.description}
                              </p>

                              <p className="text-yellow-400 font-semibold text-sm">
                                {formatPrice(item.pricing)}
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 mt-3">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onToggleAvailability(item.id!, !item.isAvailable)}
                                className={`flex-1 text-xs ${item.isAvailable
                                  ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                                  : "border-green-600/50 text-green-400 hover:bg-green-600/10"
                                  }`}
                              >
                                {item.isAvailable ? "Mark Unavailable" : "Mark Available"}
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onEdit(item)}
                                className="border-blue-600/50 text-blue-400 hover:bg-blue-600/10"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setDeleteConfirm(item.id!)}
                                className="border-red-600/50 text-red-400 hover:bg-red-600/10"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111111] rounded-lg border border-gray-800 p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2">Delete Menu Item</h3>
                  <p className="text-gray-400 text-sm">
                    Are you sure you want to delete this item? This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    onDelete(deleteConfirm);
                    setDeleteConfirm(null);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Preview"
                className="w-full h-auto rounded-lg"
              />
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
                onClick={() => setSelectedImage(null)}
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
