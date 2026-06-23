import mongoose, { Schema, Document, Model } from 'mongoose';

// TypeScript Interface
export interface IVariant {
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'Free Size';
  stock: number;
}

export interface IProduct extends Document {
  title: string;
  slug: string;
  price: number;
  images: string[];
  category:
    | 'Jersey'
    | 'Trousers'
    | 'T-Shirt'
    | 'Polo'
    | 'Shorts'
    | 'Compression'
    | 'Caps'
    | 'Vest'
    | 'Jackets'
    | 'Others';
  fabric:
    | 'Dry-Fit'
    | 'Cotton'
    | 'Mesh'
    | 'Polyester'
    | 'Cotton-Polyester Blend'
    | 'Nylon';
  fit: 'Compression' | 'Slim' | 'Regular' | 'Oversized' | 'Relaxed';
  sport:
    | 'Football'
    | 'Running'
    | 'Gym/Lifting'
    | 'Cricket'
    | 'Basketball'
    | 'General';
  variants: IVariant[];
  status: 'active' | 'draft';
  featured: boolean;
  totalStock: number; // Virtual
  stockStatus: string; // Virtual
  createdAt: Date;
  updatedAt: Date;
}

// Variant Sub-Schema
const VariantSchema = new Schema<IVariant>(
  {
    size: {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'],
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  { _id: false }
);

// Main Product Schema
const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, lowercase: true },
    price: { type: Number, required: true, min: 0 },
    images: [{ type: String, required: true }],
    category: {
      type: String,
      enum: [
        'Jersey',
        'Trousers',
        'T-Shirt',
        'Polo',
        'Shorts',
        'Compression',
        'Caps',
        'Vest',
        'Jackets',
        'Others',
      ],
      required: true,
    },
    fabric: {
      type: String,
      enum: [
        'Dry-Fit',
        'Cotton',
        'Mesh',
        'Polyester',
        'Cotton-Polyester Blend',
        'Nylon',
      ],
      required: true,
    },
    fit: {
      type: String,
      enum: ['Compression', 'Slim', 'Regular', 'Oversized', 'Relaxed'],
      required: true,
    },
    sport: {
      type: String,
      enum: [
        'Football',
        'Running',
        'Gym/Lifting',
        'Cricket',
        'Basketball',
        'General',
      ],
      required: true,
    },
    variants: {
      type: [VariantSchema],
      required: true,
      validate: {
        validator: (v: IVariant[]) => v.length > 0,
        message: 'At least one size variant is required',
      },
    },
    status: { type: String, enum: ['active', 'draft'], default: 'draft' },
    featured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// VIRTUAL: Total stock across all variants
ProductSchema.virtual('totalStock').get(function (this: IProduct) {
  return this.variants.reduce((sum, v) => sum + v.stock, 0);
});

// VIRTUAL: Stock status string
ProductSchema.virtual('stockStatus').get(function (this: IProduct) {
  const total = this.variants.reduce(
    (sum: number, v: IVariant) => sum + v.stock,
    0
  );
  if (total === 0) return 'out-of-stock';
  if (total < 3) return 'low-stock';
  return 'in-stock';
});

// DATABASE INDEXES (critical for query performance)
ProductSchema.index({ slug: 1 }, { unique: true });
ProductSchema.index({ status: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ fabric: 1 });
ProductSchema.index({ fit: 1 });
ProductSchema.index({ sport: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ status: 1, category: 1, fabric: 1 }); // Compound for filters

// PRE-SAVE: Auto-generate unique slug
ProductSchema.pre('save', async function (next) {
  if (!this.isModified('title') && this.slug) return next();

  const base = this.title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  let slug = base;
  let count = 0;
  const ProductModel = mongoose.model('Product');

  // eslint-disable-next-line no-await-in-loop
  while (await ProductModel.exists({ slug, _id: { $ne: this._id } })) {
    count++;
    slug = `${base}-${count}`;
  }

  this.slug = slug;
  next();
});

const Product: Model<IProduct> =
  mongoose.models.Product ||
  mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
