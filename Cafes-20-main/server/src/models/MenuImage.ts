import mongoose, { Document, Schema } from 'mongoose';

export interface IMenuImage extends Document {
  _id: string;
  name: string;
  url: string;
  cloudinaryId: string;
  size: number;
  mimeType: string;
  uploadDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MenuImageSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  cloudinaryId: {
    type: String,
    required: true
    // Remove unique: true to avoid duplicate index warning
  },
  size: {
    type: Number,
    required: true,
    min: 0
  },
  mimeType: {
    type: String,
    required: true,
    enum: ['image/jpeg', 'image/png', 'image/webp']
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.cloudinaryId; // Don't expose cloudinary ID to frontend
      return ret;
    }
  }
});

// Index for better query performance
MenuImageSchema.index({ isActive: 1, uploadDate: -1 });
MenuImageSchema.index({ cloudinaryId: 1 }, { unique: true }); // Explicit unique index

// Prevent model overwrite error in development (HMR)
export const MenuImage = mongoose.models.MenuImage || mongoose.model<IMenuImage>('MenuImage', MenuImageSchema);