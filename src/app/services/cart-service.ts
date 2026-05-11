import { Injectable, signal } from '@angular/core';
import { Api } from './api';

@Injectable({ providedIn: 'root' })

export class CartService {

  cart = signal<any>(null);

  constructor(private api: Api) {}

  page = 1;
  take = 12;
  hasMore = false;

loadCart() {
  this.api.getCart(this.take, this.page).subscribe({
    next: (res: any) => {
      console.log('Данные корзины из API:', res.data);
      if (res && res.data) {
        // Обертка в setTimeout переносит обновление сигнала в следующий цикл,
        // это лечит ошибку NG0100
        setTimeout(() => {
          this.cart.set(res.data);
        }, 0);
      }
    },
    error: (err) => {
      console.error('Could not load cart', err);
      this.cart.set(null);
    }
  });
}
 

 addProductToCart(productId: number, quantity: number): void {
  console.log('Кнопка нажата для ID:', productId);
  this.api.addToCart(productId, quantity).subscribe({
    next: (response: any) => {
      // Проверяем статус успеха из ответа API
      if (response.isSuccess) {
        console.log('Success:', response.message);
        
        // 1. Показываем сообщение об успехе пользователю
        alert(response.message || 'Product added to cart!'); 
        
        // 2. Обновляем корзину
        this.loadCart();
      } else {
        // Если isSuccess: false (например, товара нет в наличии)
        alert(response.message || 'Could not add product');
      }
    },
    error: (err: any) => {
      console.error('API Error:', err);
      
      // Достаем message из ошибки, если сервер прислал 400 Bad Request
      const errorMessage = err.error?.message || 'Failed to add product to cart';
      alert(errorMessage);
    }
  });
}

  editQuantity(itemId: number, quantity: number) {
    return this.api.editquantity(itemId, quantity).subscribe({
      next: (response) => {
        console.log('Quantity updated:', response);
        this.loadCart();
      },
      error: (err) => {
        console.error('Failed to update quantity:', err);
        alert('Failed to update quantity');
      }
    });
  }

  deleteProductfromCart(productId: number) {
    return this.api.deleteProductfromCart ({ productId }).subscribe({
      next: () => {
        console.log(`Товар ${productId} успешно удален`);
       
        this.loadCart(); 
      },
      error: (err) => {
        console.error('Ошибка при удалении товара:', err);
        if (err.status === 401) {
          alert('Ваша сессия истекла. Пожалуйста, войдите снова.');
        }
      }
    });
}
  

  checkout(take: number, page: number) {
  const currentCart = this.cart();
  const countToOrder = currentCart?.totalCount || currentCart?.items?.length || 0;

  if (countToOrder === 0) {
    alert('Корзина пуста');
    return;
  }

  return this.api.checkout(countToOrder, 1).subscribe({
    next: (response: any) => {
      this.page = 1;
      console.log('Заказ оформлен!', response);
      this.loadCart();

      // Достаем сообщение из вложенного объекта error
      // Если сервер прислал isSuccess: true, текст обычно в response.error.message
      const successMsg = response.error?.message || 'The order has been successfully completed!';
      alert(successMsg);
    },
    error: (err: any) => {
      console.error('Ошибка при оформлении заказа:', err);

      // Проверяем наличие сообщения в теле ошибки (err.error)
      // В Swagger видно, что структура сообщения: error: { message: "string" }
      const errorMsg = err.error?.error?.message || 'Не удалось оформить заказ. Пожалуйста, попробуйте снова.';
      alert(errorMsg);
    }
  });
}
nextPage(): void {
    if (this.hasMore) {
      this.page++;
      this.loadCart();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadCart();
    }
  }
}