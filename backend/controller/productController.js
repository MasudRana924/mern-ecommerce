const Product = require("../model/productModel");
const ErrorHandler = require("../utilities/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utilities/apiSearchFilter");

//product module theke product asbe 

//product create 
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(200).json({
        success: true,
        product
    })
})


//all products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
    
    const productsCount = await Product.countDocument
    const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();
    let products = await apiFeature.query;
    let filteredProductsCount = products.length;
    res.status(200).json({
        success: true,
        products,
        productsCount,
        filteredProductsCount,
    });
   
})
// Get All Product (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

//update
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(500).json({
            success: false,
            message: "product not fount"
        })
    }
    //jodi product thake tahole re.param.id te re.body r maddhome data update 
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    //update er kaj sesh tai res send 
    res.status(200).json({
        success: true,
        product,
    });
})

//product details
exports.getSingleProductDetails = catchAsyncErrors(async (req, res, next) => {
     const product = await Product.findById(req.params.id);
    
    if (!product) {
        //next er maddhome error handler middleware take use korlam , next diyei middleware call kore
        return next(new ErrorHandler("Product is not found ", 404))
    }
    res.status(200).json({
        success: true,
        product,
    });
})
//delete product 
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        //next er maddhome error handler middleware take use korlam , next diyei middleware call kore
        return next(new ErrorHandler("Product is not found ", 404))
    }
    await product.remove();

    res.status(200).json({
        success: true,
        message: "Product Delete Successfully",
    });
})

// Create New Review or Update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
  
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
  
    const product = await Product.findById(productId);
  
    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
  
    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }
  
    let avg = 0;
  
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    }); //average review
  
    product.ratings = avg / product.reviews.length;
  
    await product.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
    });
  });
  
  // Get All Reviews of a product
  exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
  
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  });
  
  // Delete Review
  exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
  
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    ); //jeita delete korbo seita hobe
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
  });