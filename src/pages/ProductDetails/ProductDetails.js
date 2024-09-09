import { useState, useEffect } from "react";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import { Link, useParams } from "react-router-dom";
import { GrFormAdd } from "react-icons/gr";
import { MdRemove } from "react-icons/md";
import "./ProductDetails.css";
import Carousel from "react-multi-carousel";
import axios from "axios";
import HomeProduct from "../../components/HomeProduct/HomeProduct";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductItemPending,
  fetchProductItemFailed,
  fetchProductItemFulfilled,
} from "../../redux/slices/productItemSlice";

import {
  randomProductsPending,
  randomProductsFulfilled,
  randomProductsFailed,
} from "../../redux/slices/radnomProductsSlice";

import {
  increaseCartQuantity,
  decreaseCartQuantity,
} from "../../redux/slices/cartSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product.productItem);
  const data = useSelector((state) => state.random.products);

  const quantity = useSelector((state) => {
    const item = state.cart.cartItems.find((item) => item.id === id);
    return item ? item.quantity : 0;
  });

  useEffect(() => {
    getData();
    getRndData();
  }, [id]);

  const getData = async () => {
    dispatch(fetchProductItemPending());
    try {
      const res = await axios.get(
        `https://tout-de-sweet-backend.vercel.app/api/products/${id}`
      );
      dispatch(fetchProductItemFulfilled(res.data.response));
    } catch (error) {
      dispatch(fetchProductItemFailed(error));
    }
  };

  const getRndData = async () => {
    dispatch(randomProductsPending());
    try {
      const res = await axios.get(
        `https://tout-de-sweet-backend.vercel.app/api/products/randomfive`
      );
      dispatch(randomProductsFulfilled(res.data.response));
    } catch (error) {
      dispatch(randomProductsFailed());
    }
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <div>
      <Navbar />
      <>
        <div className="details-container">
          <div className="shop-breadcrumb">
            <Breadcrumb />
          </div>
          <div className="product-details">
            <div className="image-description">
              <div className="image-only">
                <img src={product.image} alt={product.name} />
              </div>
            </div>
            <div className="product-details-right">
              <div className="description-price">
                <h2>{product.name}</h2>
                <div className="seperate"></div>
                <p className="product-desc">{product.description}</p>
                {product.price === 0 ? null : (
                  <p>Price: AED {product.price}.00</p>
                )}
              </div>
              <div className="sum-container">
                <h5>Add to cart : </h5>
                <div className="add-rm-container">
                  <button
                    onClick={() => dispatch(decreaseCartQuantity(id))}
                    className="cart-icons"
                  >
                    <MdRemove />
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => dispatch(increaseCartQuantity(id))}
                    className="cart-icons"
                  >
                    <GrFormAdd />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>

      <div className="you-make-like-container">
        <h1 className="you-make-like">You may also like</h1>
        <Carousel responsive={responsive}>
          {data.map((data) => {
            return (
              <div key={data._id}>
                <Link to={`/shop/${data._id}`}>
                  <HomeProduct
                    image={data.image[0]}
                    name={data.name}
                    price={data.price}
                  />
                </Link>
              </div>
            );
          })}
        </Carousel>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetails;
