import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { GlobalState } from '../../../GlobalState';
import axios from 'axios';


const Cart = () => {
    const state = useContext(GlobalState)
    const [cart, setCart] = state.userAPI.cart
    const [total, setTotal] = useState(0)
    const [token] = state.token

    useEffect(() => {
        const getTotal = () => {
            const total = cart.reduce((prev, item) => {
                return prev + (item.price * item.quantity)
            }, 0)
            setTotal(total)
        }
        getTotal()
    }, [cart])

    const addToCart = async (cart) => {
        await axios.patch('/user/addcart', { cart }, {
            headers: { Authorization: token }
        })
    }

    const increment = (id) => {
        cart.forEach(item => {
            if (item._id === id) {
                item.quantity += 1
            }
        })
        setCart([...cart])
        addToCart(cart)
    }
    const decrement = (id) => {
        cart.forEach(item => {
            if (item._id === id) {
                item.quantity === 1 ? item.quantity = 1 : item.quantity -= 1
            }
        })
        setCart([...cart])
        addToCart(cart)
    }

    const removeProduct = id => {
        if (window.confirm("Do you want to remove this item?")) {
            cart.forEach((item, index) => {
                if (item._id === id) {
                    cart.splice(index, 1)
                }
            })
            setCart([...cart])
            addToCart(cart)
        }
    }

    const tranSuccess = async (payment) => {
        const { paymentID, address } = payment;

        await axios.post('/api/payment', (cart, paymentID, address), {
            headers: { Authorization: token }
        })

        setCart({})
        addToCart([])
        alert("You have succesfully placed an order.")

    }

    if (cart.length === 0)
        return <h2 style={{ textAlign: "center", justifyContent: "center", fontSize: "5rem" }}>Cart Empty</h2>

    return (
        <div>
            {
                cart.map(product => (
                    <div className='detail cart' key={product._id}>
                        <img src={product.images.url} alt={product.title} />

                        <div className="box-detail">

                            <h2>{product.title}</h2>

                            <h3>{'\u20A6'} {product.price * product.quantity}</h3>
                            <p>{product.description}</p>
                            <p>{product.content} </p>
                            <p>Sold: {product.sold} </p>

                            <div className="amount">
                                <button onClick={() => decrement(product._id)}> - </button>
                                <span>{product.quantity}</span>
                                <button onClick={() => increment(product._id)}> + </button>
                            </div>

                            <div className="delete" onClick={() => removeProduct(product._id)}>X</div>
                        </div>
                    </div>
                ))
            }

            <div className="total">
                <h3>Total: {'\u20A6'} {total}</h3>
                <Link to="#!">Payment</Link>
            </div>
        </div>
    )
}

export default Cart
