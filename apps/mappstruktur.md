NUVARANDE 

SHOPFLOW
|-- apps/
|   |-- backend/
|   |   |-- .env
|   |   |-- package.json
|   |   |-- tsconfig.json
|   |   |-- src/
|   |   |   |-- server.ts
|   |   |   |-- config/
|   |   |   |   |-- db.ts
|   |   |   |-- controllers/
|   |   |   |   |-- addressController.ts
|   |   |   |   |-- authController.ts
|   |   |   |   |-- brandsController.ts
|   |   |   |   |-- cartController.ts
|   |   |   |   |-- cartItemController.ts
|   |   |   |   |-- categoryController.ts
|   |   |   |   |-- orderController.ts
|   |   |   |   |-- paymentController.ts
|   |   |   |   |-- productsController.ts
|   |   |   |   |-- userController.ts
|   |   |   |-- middleware/
|   |   |   |   |-- authenticateToken.ts
|   |   |   |   |-- authorizeRoles.ts
|   |   |   |   |-- errorHandler.ts
|   |   |   |   |-- HttpError.ts
|   |   |   |   |-- logger.ts
|   |   |   |   |-- notFound.ts
|   |   |   |   |-- resolveAddressOwner.ts
|   |   |   |-- models/
|   |   |   |   |-- Address.ts
|   |   |   |   |-- Brands.ts
|   |   |   |   |-- Cart.ts
|   |   |   |   |-- CartItem.ts
|   |   |   |   |-- Categories.ts
|   |   |   |   |-- Order.ts
|   |   |   |   |-- OrderItems.ts
|   |   |   |   |-- Payment.ts
|   |   |   |   |-- Products.ts
|   |   |   |   |-- ProductVariant.ts
|   |   |   |   |-- User.ts
|   |   |   |-- routes/
|   |   |   |   |-- addressRoutes.ts
|   |   |   |   |-- brandRoutes.ts
|   |   |   |   |-- cartItemRoutes.ts
|   |   |   |   |-- cartRoutes.ts
|   |   |   |   |-- categoryRoutes.ts
|   |   |   |   |-- orderRoutes.ts
|   |   |   |   |-- paymentRoutes.ts
|   |   |   |   |-- productRoutes.ts
|   |   |   |   |-- userRoutes.ts
|   |   |   |-- services/
|   |   |   |   |-- addressService.ts
|   |   |   |   |-- authService.ts
|   |   |   |   |-- brandService.ts
|   |   |   |   |-- cartItemService.ts
|   |   |   |   |-- cartService.ts
|   |   |   |   |-- categoryService.ts
|   |   |   |   |-- orderService.ts
|   |   |   |   |-- paymentService.ts
|   |   |   |   |-- productService.ts
|   |   |   |   |-- userService.ts
|   |   |   |-- types/
|   |   |   |   |-- address.types.ts
|   |   |   |   |-- authTypes.ts
|   |   |   |   |-- cart.types.ts
|   |   |   |   |-- express.d.ts
|   |   |   |   |-- session.d.ts
|   |   |   |-- utils/
|   |   |   |   |-- getAddressOwner.ts
|   |   |   |   |-- getCartOwner.ts



==================================================================
SKISS

SHOPFLOW
|-- apps/
|   |-- backend/
|   |   |-- .env
|   |   |-- package.json
|   |   |-- tsconfig.json
|   |   |-- src/
|   |   |   |-- server.ts
|   |   |   |-- config/
|   |   |   |   |-- db.ts
|   |   |   |-- controllers/
|   |   |   |-- errors/ <--                 // Egna feltyper   
|   |   |   |   |-- HttpError.ts
|   |   |   |   |-- ValidationError.ts
|   |   |   |-- middleware/ <--             // validate.ts + befintlig middleware
|   |   |   |   |-- validate.ts
|   |   |   |   |-- errorHandler.ts
|   |   |   |   |-- notFound.ts
|   |   |   |   |-- authenticateToken.ts
|   |   |   |   |-- authorizeRoles.ts
|   |   |   |-- models/
|   |   |   |-- routes/
|   |   |   |-- schemas/ <--                // regler för input-data
|   |   |   |   |-- address.schema.ts
|   |   |   |   |-- brands.schema.ts
|   |   |   |   |-- cart.schema.ts
|   |   |   |   |-- cartItems.schema.ts
|   |   |   |   |-- categories.schema.ts
|   |   |   |   |-- order.schema.ts
|   |   |   |   |-- orderItems.schema.ts
|   |   |   |   |-- payment.schema.ts
|   |   |   |   |-- product.schema.ts
|   |   |   |   |-- productVariant.schema.ts
|   |   |   |   |-- user.schema.ts
|   |   |   |-- services/
|   |   |   |-- types/
|   |   |   |-- utils/

