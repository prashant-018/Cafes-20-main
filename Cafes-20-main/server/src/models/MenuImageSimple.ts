import mongoose, { Document, Schema } from 'mongoose';

console.log('📦 Loading MenuImageSimple model...');

export interface IMenuImageSimple extends Document {
  name: string;
  filename: string;
  url: string;
  size: number;
  uploadDate: Date;
}

const MenuImageSimpleSchema = new Schema<IMenuImageSimple>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    filename: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
    size: {
      type: Number,
      required: true
    },
    uploadDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

const MenuImageSimple = mongoose.models.MenuImageSimple ||
  mongoose.model<IMenuImageSimple>('MenuImageSimple', MenuImageSimpleSchema);

console.log('✅ MenuImageSimple model loaded');

export default MenuImageSimple;
