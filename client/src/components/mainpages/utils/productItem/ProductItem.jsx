import React from 'react';
import BtnRender from './BtnRender';

const ProductItem = ({ product, isAdmin, deleteProduct, handleCheck }) => {


    return (
        <div className='product-card'>
            {
                isAdmin && <input type='checkbox' checked={product.checked} onChange={()=>handleCheck(product._id)} />
            }
            <img src={product.images.url} alt={product.title} />

            <div className="product-box">
                <h2 title={product.title}>{product.title}</h2>
                <span>{'\u20A6'} {product.price}</span>
                <p>{product.description}</p>
            </div>

            <BtnRender product={product} deleteProduct={deleteProduct} />
        </div>
    )
}

export default ProductItem