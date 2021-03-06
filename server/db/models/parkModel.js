

const mongoose = require('mongoose');
const slugify = require('slugify');



const parkSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, 'A park must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A park name must have less or equal then 40 characters'],
        minlength: [10, 'A park name must have more or equal then 10 characters']
        // validate: [validator.isAlpha, 'Tour name must only contain characters']
      },
      slug: String,
      duration: {
        type: Number,
        required: [true, 'Choose Duration']
      },
      maxGroupSize: {
        type: Number,
        required: [true, 'Must have a group size']
      },
      difficulty: {
        type: String,
        required: [true, 'A  must have a difficulty'],
        enum: {
          values: ['easy', 'medium', 'difficult'],
          message: 'Difficulty is either: easy, medium, difficult'
        }
      },
      ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
      },
      ratingsQuantity: {
        type: Number,
        default: 0
      },
      price: {
        type: Number,
        required: [true, 'A campsite must have a price']
      },
      priceDiscount: {
        type: Number,
        validate: {
          validator: function(val) {
            // this only points to current doc on NEW document creation
            return val < this.price;
          },
          message: 'Discount price ({VALUE}) should be below regular price'
        }
      },
      summary: {
        type: String,
        trim: true,
        required: [true, 'A Park must have a description']
      },
      description: {
        type: String,
        trim: true
      },
      imageCover: {
        type: String,
        required: [true, 'A Park must have a cover image']
      },
      images: [String],
      createdAt: {
        type: Date,
        default: Date.now(),
        select: false
      },
      startDates: [Date],
      secretTour: {
        type: Boolean,
        default: false
      },
      startLocation: {
        // GeoJSON
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
      },
      locations: [
        {
          type: {
            type: String,
            default: 'Point',
            enum: ['Point']
          },
          coordinates: [Number],
          address: String,
          description: String,
          day: Number
        }
      ],
      guides: [
        {
          type: mongoose.Schema.ObjectId,
          ref: 'User'
        }
      ]
    },
    {
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
    }
  );

  parkSchema.index({ price: 1, ratingsAverage: -1 });
  parkSchema.index({ slug: 1 });
  parkSchema.index({ startLocation: '2dsphere' });
  
  parkSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
  });
  
  // Virtual populate
  parkSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'park',
    localField: '_id'
  });
  
  // DOCUMENT MIDDLEWARE: runs before .save() and .create()
  parkSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
  });
  

  parkSchema.pre(/^find/, function(next) {
    this.find({ secretPark: { $ne: true } });
  
    this.start = Date.now();
    next();
  });
  
  parkSchema.pre(/^find/, function(next) {
    this.populate({
      path: 'guides',
      select: '-__v -passwordChangedAt'
    });
  
    next();
  });
  
  const Park = mongoose.model('Park', parkSchema);
  module.exports = Park;