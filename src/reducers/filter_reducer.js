import {
  LOAD_PRODUCTS,
  SET_LISTVIEW,
  SET_GRIDVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from "../actions";

const filter_reducer = (state, action) => {
  if (action.type === LOAD_PRODUCTS) {
    //[...action.payload] this just copy the payload into array
    let maxPrice = action.payload.map((p) => p.price);
    maxPrice = Math.max(...maxPrice);
    return {
      ...state,
      all_products: [...action.payload],
      filtered_products: action.payload,
      filters: { ...state.filters, max_price: maxPrice, price: maxPrice },
    };
  }
  if (action.type === SET_GRIDVIEW) {
    return { ...state, grid_view: true };
  }
  if (action.type === SET_LISTVIEW) {
    return { ...state, grid_view: false };
  }
  if (action.type === UPDATE_SORT) {
    return { ...state, sort: action.payload };
  }
  if (action.type === SORT_PRODUCTS) {
    const { sort, filtered_products } = state;
    let tempArray = [...filtered_products];
    if (sort === "price-lowest") {
      tempArray = tempArray.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-highest") {
      tempArray = tempArray.sort((a, b) => b.price - a.price);
    }

    if (sort === "name-a") {
      tempArray = tempArray.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sort === "name-z") {
      tempArray = tempArray.sort((a, b) => b.name.localeCompare(a.name));
    }
    return { ...state, filtered_products: tempArray };
  }
  if (action.type === UPDATE_FILTERS) {
    const { name, value } = action.payload;
    return { ...state, filters: { ...state.filters, [name]: value } };
  }
  if (action.type === FILTER_PRODUCTS) {
    const { all_products } = state;
    const { text, category, company, color, price, shipping } = state.filters;
    let tempProduct = [...all_products];
    if (text) {
      tempProduct = tempProduct.filter((product) => {
        return product.name.toLowerCase().includes(text);
      });
    }
    if (category !== "all") {
      tempProduct = tempProduct.filter(
        (product) => product.category === category
      );
    }
    if (company !== "all") {
      tempProduct = tempProduct.filter(
        (product) => product.company===company
      );
    }
    
    
    if (color !== "all") {
      tempProduct = tempProduct.filter((product) =>
        
        //double call back bcos the colors is an array
        product.colors.find((c)=>c===color)
      
         
      );
    }
    if (price<state.filters.max_price) {
      tempProduct = tempProduct.filter(
        (product) => product.price<=price
      );
    }
   
    if (shipping){
      tempProduct=tempProduct.filter((product)=>
        product.shipping===true
      )
    }
    return { ...state, filtered_products: tempProduct };
  }
  if (action.type === CLEAR_FILTERS) {
    return {
      ...state,
      filters: {
        ...state.filters,
        text: "",
        category: "all",
        company: "all",
        color: "all",
        price: state.filters.max_price,
        shipping: false,
      },
    };
  }

  throw new Error(`No Matching "${action.type}" - action type`);
};
export default filter_reducer;
