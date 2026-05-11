import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddProduct, Categories, ProductsClass, ProfileData, UsersEditProfile } from '../models/product';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { ApiAuth } from '../services/api-auth';
import { Api } from '../services/api';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
})
export class Profile implements OnInit {
  data?: ProfileData;
  profileForm: FormGroup = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    phoneNumber: new FormControl(''),
    address: new FormControl(''),
    age: new FormControl(0),
    picture: new FormControl(''),
  });
  isLoading = true;
  errorMessage = '';
  products: any[] = [];
  
  activeTab: 'Personal information' | 'Change Password' | 'Account Settings' |'Categories' |'Products'|undefined = 'Personal information';
setTab(tab: 'Personal information' | 'Change Password' | 'Account Settings' | 'Categories' | 'Products') {
    this.activeTab = tab;
    if (tab === 'Products') {
    this.getProducts(); 
  }

  if (tab === 'Categories') {
    this.getCategory();
  }

    this.cdr.detectChanges();
  }


  passwordForm: FormGroup = new FormGroup({
    oldPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required,Validators.minLength(6), Validators.pattern(/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).+$/)
  ]),
    confirmPassword: new FormControl('',[Validators.required])
  });


  constructor(
    private apiAuth: ApiAuth, 
    private router: Router, 
    private api: Api,
    private auth: Auth,
    private cdr : ChangeDetectorRef) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    // const cachedData = this.auth.getProfileData();
    // if (cachedData) {
    //   this.data = cachedData;
    //   this.profileForm.patchValue({
    //     firstName: cachedData.firstName,
    //     lastName: cachedData.lastName,
    //     email: cachedData.email,
    //     phoneNumber: cachedData.phoneNumber ?? '',
    //     address: cachedData.address ?? '',
    //     age: cachedData.age ?? 0,
    //     picture: cachedData.picture ?? '',
    //   });
    //   this.isLoading = false;
    //   setTimeout(() => {
    //     this.cdr.detectChanges();
    //   }, 0);
    //   return;
    // }
    
    this.apiAuth.getDatafromApiProfile({ token }).subscribe({
      next: (response: { data: ProfileData, meta: any }): void => {
        console.log(response);
        const userData = response.data;
        this.data = userData;
        this.auth.setProfileData(userData)    
         this.profileForm.patchValue({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phoneNumber: userData.phoneNumber ?? '',
          address: userData.address ?? '',
          age: userData.age ?? 0,
          picture: userData.picture ?? '',
        });       
       this.getCategory();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error(err);
        this.errorMessage = 'Не удалось загрузить профиль. Пожалуйста, повторите попытку.';
        this.isLoading = false;
      }
    });
  }

  saveChanges(): void {
    if (!this.profileForm.valid) {
      return;
    }

    const { firstName, lastName, phoneNumber, address, age, picture } = this.profileForm.value;

    this.api.usersEditProfile(firstName, lastName, picture, phoneNumber ?? '', address ?? '', age ?? 0)
      .subscribe({
        next: (response: any): void => {
          console.log('Ответ от сервера:',response);
         
       if (this.data) {
          const updatedData = { 
              ...this.data, 
              ...this.profileForm.value 
            } as ProfileData;
            this.data = updatedData;
            this.auth.setProfileData(updatedData);
        } 
        
        this.isLoading = false;
        alert('Профиль успешно обновлен!');
        console.log('Profile updated successfully');
        this.cdr.detectChanges();          
                  
        },
        error: (err: any) => {
          console.error(err);
          alert('Ошибка при обновлении профиля. Пожалуйста, попробуйте снова.');
        },
      });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('email');
    this.auth.signOut();
    this.router.navigate(['/login']);
  }

 changePassword(): void {

  if (this.passwordForm.invalid) return;

  this.api.usersChangePassword(
    this.passwordForm.value.oldPassword,  // Достаем из passwordForm!
    this.passwordForm.value.newPassword, 
    this.passwordForm.value.confirmPassword
  ).subscribe({
    next: (response: any) => {
      alert('Пароль успешно изменен!');
      this.passwordForm.reset(); // Очищаем поля после успеха
    },
    error: (err: any) => {
      console.error(err);
      alert('Ошибка: проверьте правильность старого пароля');
    }
  });
}

deleteAccount(): void {
  if (confirm('Вы уверены, что хотите удалить свой профиль? Это действие необратимо.')) {
    this.api.deleteUser().subscribe({
      next: () => {
        alert('Ваш профиль был успешно удален.');
        this.logout();
      },
      error: (err) => {
        console.error('Ошибка при удалении:', err);
        alert('Не удалось удалить профиль. Попробуйте позже.');
      }
    });
  }
}
category: { category: any[] } = { category: Categories.list };
loading = false;
getCategory():void {
  this.loading = true;
this.api.getDatafromApi(`api/categories`).subscribe({
    next: (response: any) => {
      console.log(response.data);
      this.category.category = [...response.data];
     console.log('Категории загружены:', this.category.category);
      this.cdr.detectChanges();
      this.loading = false;
},
  error: (_err): void => {
      alert('Failed to load menu');
      this.loading = false;
    }
  }); 

}
isAddCategoryModalOpen = false;
newCategoryName = '';
addCategory(): void {
  this.isAddCategoryModalOpen = true;
  this.newCategoryName = '';
}
confirmAddCategory(): void {
  if (this.newCategoryName.trim()) {
    this.api.postCategory(this.newCategoryName.trim()).subscribe({
      next: (response: any) => {
        // Очищаем и закрываем сразу для отзывчивости интерфейса
        this.isAddCategoryModalOpen = false;
        const addedName = this.newCategoryName;
        this.newCategoryName = '';

        // Небольшая задержка в 300мс решает проблему "исчезновения"
        setTimeout(() => {
          this.getCategory();
        }, 300);
      },
      error: (err: any) => {
        console.error(err);
        alert('Ошибка при добавлении.');
      }
    });
  }
}

isEditCategoryModalOpen = false;
editCategoryId: number | null = null;
editCategoryName = '';

closeModal(): void {
  this.isAddCategoryModalOpen = false;
  this.isEditCategoryModalOpen = false;  
  this.editCategoryName = '';
}


editCategory(category: any): void {
  if (!category) return;
  console.log('Выбрана категория:', category.id);
  this.editCategoryId = category.id;
  this.editCategoryName = category.name;
  this.isEditCategoryModalOpen = true;
  this.cdr.detectChanges();
}

confirmEditCategory(): void {
  if (this.editCategoryId!== null && this.editCategoryName.trim()) {
     
    const newName = this.editCategoryName.trim();;

    this.api.putCategory(this.editCategoryId, { name: newName }).subscribe({
      next: (response: any) => {
        alert('Категория успешно обновлена!');
        this.getCategory();
        this.closeModal();
      },
      error: (err: any) => {
        console.error('Ошибка:', err);
        alert('Не удалось обновить категорию.');
      }
    });
  } else {
    alert('Пожалуйста, введите название категории.');
  }
}

deleteCategory(id: number): void {
  if (confirm('Вы уверены, что хотите удалить эту категорию?')) {
    this.api.deleteCategory(id).subscribe({
      next: (response: any) => {
        alert('Категория успешно удалена!');
        this.getCategory(); 
      },
      error: (err: any) => {
        console.error(err);
        alert('Ошибка при удалении категории. Пожалуйста, попробуйте снова.');
      }
    });
  }
}
  page = 1;
  take = 12;
  hasMore = false;
  getProducts(): void {
  this.loading = true;
  
  const params = `Take=${this.take}&Page=${this.page}`;
  
  this.api.getDatafromApi(`api/products?${params}`).subscribe({
    next: (response: any) => {
      if (response && response.data && Array.isArray(response.data.products)) {
        this.products = response.data.products;        
        
        this.hasMore = response.data.hasMore; 
        
        console.log('Загружена страница:', this.page);
      } else {
        this.products = [];
      }
      this.loading = false;
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error(err);
      this.loading = false;
      this.cdr.detectChanges();
    }
  });
}
nextPage(): void {
    if (this.hasMore) {
    this.page++;
    this.getProducts();
  }
  }
   
  prevPage(): void{
     if (this.page > 1){
    this.page--;
    this.getProducts();
  }
  }
isAddProductModalOpen = false;

newProduct: AddProduct = new AddProduct();
newIngredient: string = '';

addProduct(): void {
  this.isAddProductModalOpen = true;
  this.newProduct = new AddProduct();
  this.newProduct.ingredients = [];
  this.newProduct.spiciness = 0;
  this.newProduct.price = 0;
  this.newProduct.method = 'manual'
  
  
  if (this.category.category && this.category.category.length > 0) {
    this.newProduct.categoryId = this.category.category[0].id;
  }
}

addIngredient(): void {
  const ingredient = this.newIngredient.trim();
  if (ingredient) {
    // Добавляем строку напрямую в массив объекта
    this.newProduct.ingredients.push(ingredient);
    this.newIngredient = '';
  }
}

removeIngredient(index: number): void {
  this.newProduct.ingredients.splice(index, 1);
}

confirmAddProduct(): void {
  
  if (!this.newProduct.name || this.newProduct.price <= 0) {
    alert('Пожалуйста, заполните название и цену!');
    return;
  }

  this.api.postProduct(this.newProduct).subscribe({
    next: () => {
      alert('Продукт успешно добавлен!');
      this.isAddProductModalOpen = false;
      this.getProducts(); // Обновляем список на странице
    },
    error: (err) => {
      console.error('Ошибка API:', err);
      alert('Ошибка при сохранении. Проверьте консоль (Network).');
    }
  });
}

isEditProductModalOpen = false;
editingProductId: number | null = null;

editProduct(id: number): void {
  console.log('Попытка редактирования ID:', id);
  this.isLoading = true;

  this.api.getDatafromApi(`api/products/${id}`).subscribe({
    next: (response: any) => {
      console.log('Данные от сервера:', response);
      
      this.editingProductId = id;

      // Если сервер прислал объект сразу в корне (без .data)
      const productData = response; 

      this.newProduct = {
        ...productData,
        // Проверяем разные варианты имени поля картинки
        image: productData.image || productData.picture || '', 
        ingredients: []
      };

      // Парсим ингредиенты (строка -> массив)
      const ing = productData.ingredients || productData.ingredients;
      if (typeof ing === 'string') {
        this.newProduct.ingredients = ing.split(',').map(s => s.trim());
      } else if (Array.isArray(ing)) {
        this.newProduct.ingredients = ing;
      }

      // ВНИМАНИЕ: Проверь, как называется переменная для боковой панели!
      this.isEditProductModalOpen = true; 
      
      this.isLoading = false;
      this.cdr.detectChanges(); // Принудительно обновляем UI
    },
    error: (err) => {
      console.error('Ошибка API:', err);
      this.isLoading = false;
      alert('Ошибка при загрузке данных товара');
    }
  });
}

confirmEditProduct(): void {
  if (!this.editingProductId) return;

  if (!this.newProduct.name || this.newProduct.price <= 0) {
    alert('Пожалуйста, заполните название и цену!');
    return;
  }

  // Формируем объект строго по требованиям сервера
  const dataToSave = {
    ...this.newProduct,
    // 1. ОСТАВЛЯЕМ как массив (НЕ делаем .join(', '))
    ingredients: Array.isArray(this.newProduct.ingredients) 
      ? this.newProduct.ingredients 
      : [], 
    // 2. ДОБАВЛЯЕМ обязательное поле req (обычно это ID или метод)
    req: this.editingProductId.toString() 
  };

  this.api.putProduct(this.editingProductId, dataToSave).subscribe({
    next: () => {
      alert('Продукт успешно обновлен!');
      this.isEditProductModalOpen = false;
      this.editingProductId = null;
      this.getProducts(); 
    },
    error: (err) => {
    
      console.error('Ошибка при обновлении:', err);
      alert('Не удалось сохранить изменения.');
    }
  });
}

deleteProduct(id: number): void {
if (confirm('Вы уверены, что хотите удалить этот продукт?')) {
    this.api.deleteProduct(id).subscribe({
      next: (response: any) => {
        alert('Продукт успешно удален!');
        this.getProducts();
      },
      error: (err: any) => {
        console.error(err);
        alert('Ошибка при удалении категории. Пожалуйста, попробуйте снова.');
      }
    });
  }
}

}