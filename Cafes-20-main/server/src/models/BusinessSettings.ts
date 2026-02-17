import mongoose, { Document, Schema } from 'mongoose';

export interface IBusinessSettings extends Document {
  whatsappNumber: string;
  openingTime: string;
  closingTime: string;
  isManuallyOpen: boolean;
  brandStory: string;
  createdAt: Date;
  updatedAt: Date;
}

const BusinessSettingsSchema: Schema<IBusinessSettings> = new Schema(
  {
    whatsappNumber: {
      type: String,
      required: [true, 'WhatsApp number is required'],
      trim: true,
      minlength: [5, 'WhatsApp number must be at least 5 characters'],
      maxlength: [20, 'WhatsApp number must be at most 20 characters'],
    },
    openingTime: {
      type: String,
      required: [true, 'Opening time is required'],
      trim: true,
    },
    closingTime: {
      type: String,
      required: [true, 'Closing time is required'],
      trim: true,
    },
    isManuallyOpen: {
      type: Boolean,
      default: true,
    },
    brandStory: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Single-document collection is expected; index for at most one doc can be enforced via unique constraint if needed later.

const BusinessSettings =
  mongoose.models.BusinessSettings ||
  mongoose.model<IBusinessSettings>('BusinessSettings', BusinessSettingsSchema);

export default BusinessSettings;




