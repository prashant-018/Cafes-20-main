import mongoose, { Document, Schema } from 'mongoose';

export interface IMenuImageLocal extends Document {
  name: string;
  filename: string; // Actual filename on disk
  url: string; // Full URL to access the image
  size: number;
  mimeType: string;
  uploadDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MenuImageLocalSchema = new Schema<IMenuImageLocal>(
  {
    name: {
      type: String,
      required: [true, 'Image name is required'],
      trim: true,
      maxlength: [255, 'Name cannot exceed 255 characters']
    },
    filename: {
      type: String,
      required: [true, 'Filename is required'],
      trim: true
    },
    url: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true
    },
    size: {
      type: Number,
      required: [true, 'File size is required']
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
      enum: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    },
    uploadDate: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Index for faster queries
MenuImageLocalSchema.index({ isActive: 1, uploadDate: -1 });

const MenuImageLocal = mongoose.models.MenuImageLocal ||
  mongoose.model<IMenuImageLocal>('MenuImageLocal', MenuImageLocalSchema);

export default MenuImageLocal;
