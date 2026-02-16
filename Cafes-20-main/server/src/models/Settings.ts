import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  _id: string;
  whatsappNumber: string;
  openingTime: string;
  closingTime: string;
  isManuallyOpen: boolean;
  brandStory: string;
  offersText: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema: Schema<ISettings> = new Schema(
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
    offersText: {
      type: String,
      default: 'Wednesday BOGO Special - Buy One Get One Free on all medium Premium & Delight pizzas! Valid every Wednesday. Cannot be combined with other offers.',
      trim: true,
      maxlength: [500, 'Offers text must be at most 500 characters'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Settings =
  mongoose.models.Settings ||
  mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;