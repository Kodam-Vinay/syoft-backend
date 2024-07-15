const ProductModel = require("../models/productModel");
const UserModel = require("../models/userModel");

const addProduct = async (req, res) => {
  try {
    const { userDetails } = req.user;
    const { title, description, inventory_count } = req.body;
    if (!title || !description || !inventory_count) {
      return res.status(400).json({ message: "Fields Should Not Be Empty" });
    }
    const checkUserIsAdmin = userDetails?.role === "admin";
    if (!checkUserIsAdmin) {
      return res
        .status(401)
        .json({ message: "You are not allowed to add product" });
    }
    const newProduct = new ProductModel({
      title,
      description,
      inventory_count,
    });
    await newProduct.save();
    return res.status(201).json({ message: "Product Added Successfully" });
  } catch (error) {
    res.status(400).send({ message: "Something Went Wrong" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { userDetails } = req.user;
    const checkUserTypeIsAdminOrManager =
      userDetails?.role === "admin" || userDetails?.role === "manager";
    if (!checkUserTypeIsAdminOrManager) {
      return res
        .status(401)
        .json({ message: "You are not allowed to access the products" });
    }
    const products = await ProductModel.find();
    res.status(200).send({
      products,
    });
  } catch (error) {
    res.status(400).send({ message: "Something Went Wrong" });
  }
};

const getProductById = async (req, res) => {
  try {
    const { userDetails } = req.user;
    const productId = req.params.product_id;
    const checkUserTypeIsAdminOrManager =
      userDetails?.role === "admin" || userDetails?.role === "manager";
    if (!checkUserTypeIsAdminOrManager) {
      return res
        .status(401)
        .json({ message: "You are not allowed to access the products" });
    }
    const product = await ProductModel.findOne({ _id: productId });
    if (!product) {
      return res.status(400).json({ message: "Product Not Exist" });
    }
    res.status(200).send({
      product,
    });
  } catch (error) {
    res.status(400).send({ message: "Something Went Wrong" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { userDetails } = req.user;
    const requests = req.body;
    const productId = req.params.product_id;
    const checkUserTypeIsAdminOrManager =
      userDetails?.role === "admin" || userDetails?.role === "manager";
    if (!checkUserTypeIsAdminOrManager) {
      return res
        .status(401)
        .json({ message: "You are not allowed to update the product" });
    }

    const product = await ProductModel.findOne({ _id: productId });
    if (!product) {
      return res.status(400).json({ message: "Product Not Exist" });
    }

    if (Object.keys(requests).length === 0) {
      return res
        .status(400)
        .send({ message: "Update Requests Should not be empty" });
    }
    let result = false;

    Object.keys(requests).forEach((each) => {
      if (!product[each]) {
        result = true;
      }
    });
    if (result) {
      return res.status(400).send({
        message: "Your trying to update the property which not exist",
      });
    }
    const updateProductDetails = { ...product._doc, ...requests };
    const checkAnyChangesMade =
      JSON.stringify(product) !== JSON.stringify(updateProductDetails);
    if (checkAnyChangesMade) {
      await ProductModel.updateOne(
        { _id: product?._id },
        { $set: updateProductDetails },
        { new: true }
      );
      return res.status(200).send({ message: "Product Updated Successfully" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ message: "Something Went Wrong" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { userDetails } = req.user;
    const productId = req.params.product_id;
    const checkUserTypeIsAdmin = userDetails?.role === "admin";
    if (!checkUserTypeIsAdmin) {
      return res
        .status(401)
        .json({ message: "You are not allowed to delete the products" });
    }
    const product = ProductModel.findOne({ _id: productId });
    if (!product) {
      return res.status(400).json({ message: "Product Not Exist" });
    }
    await ProductModel.findByIdAndDelete({ _id: productId });
    res.status(200).send({ message: "Product Deleted Successfully" });
  } catch (error) {
    res.status(400).send({ message: "Something Went Wrong" });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
