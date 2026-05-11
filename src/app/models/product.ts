export class ProductsClass {
  id!: number;
  name!: string;
  description!: string;
  vegeterian: boolean = true;
  spiciness!: number;
  price!: number;
  image!: string;
  rate!: number ;
  canDelete!: boolean;
  hasMore: boolean = true;
 
}

export class Category {
    name!: string;
    id!: number;
    canDelete!: boolean;
}

export class CartItem {
    id!: number;
    quantity!: number;
    product!: ProductsClass;
}

export class CartClass {
    items!: CartItem[];
    totalItems?: number;
    totalPrice!: number;
}



export class ProductID{
    name!: string;
    description!: string;
    vegetarian?: boolean = true;
    spiciness!: number;
    rate!: number;
    price!: number;
    image!: string;
    method!:string;
    ingredients: string[] = [];
   

}
export class Ingredients {
  ingredients: string[] = [
    "500g mascarpone cheese",
    "5 eggs, separated",
    "100g sugar",
    "300g ladyfingers (savoiardi)",
    "300ml strong coffee, cooled",
    "2 tbsp cocoa powder",
    "Marsala wine or rum (optional)"
  ];
}

export class ProfileData {
id!: number;
firstName!: string;
lastName!: string;
email!: string;
phoneNumber?: string;
picture?: string;
address?:string;
age?: number
  products: any;
}

export class UserMe{
  id!: number;
  firstName!: string;
  lastName!: string;
  email!: string;
  role!: string;
}

export class UsersEditProfile {
  firstName!: string;
  lastName!: string;
  picture!: string;
  phoneNumber!: string;
  address!: string;
  age!: number;
}

export class ChangePassword {
  oldPassword!: string;
  newPassword!: string;
  confirmPassword!: string;
}

export class Categories{
   public static readonly list =  [  
    { id: 1, name: "Appetizer" },  
    { id: 2, name: "First Courses" },
    { id: 3, name: "Main Courses" },
    { id: 4, name: "Pizzas" },
    { id: 5, name: "Side Dishes" },
    { id: 6, name: "Desserts" },
   
  ]
}

export class CategoryClassEdit {
  id!: number;
  name!: string;
}

export class CartItemClass {
  id!: number;
  quantity!: number;
  product!: ProductsClass;
}

export class Cart {
  items!: CartItemClass[];
  totalItems?: number;
  totalPrice!: number;
}


export class AddProduct {
  name!: string;
  description!: string;
  vegetarian: boolean = true;
  spiciness!: number;
  price!: number;
  image!: string;
  rate!: number ;
  method!: string;
  ingredients: string[] = [];
  categoryId!: number;

}

export class EditProduct {
  req!: string;
  name!: string;
  description!: string;
  vegetarian: boolean = true;
  spiciness!: number;
  price!: number;
  image!: string;
  method!: string;
  ingredients: string[] = [];
  categoryId!: number;
}