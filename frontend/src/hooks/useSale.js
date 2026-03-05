
import { useState, useCallback, useMemo } from 'react';

const useSale = () => {
  const [items, setItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [customerId, setCustomerId] = useState(null);
  const [notes, setNotes] = useState('');

  // إضافة منتج إلى الفاتورة
  const addItem = useCallback((product) => {
    setItems(prev => {
      // التحقق إذا كان المنتج موجودًا مسبقًا (بنفس السعر)
      const existing = prev.find(
        item => item.productId === product.id && item.price === product.sellingPrice
      );
      if (existing) {
        // زيادة الكمية
        return prev.map(item =>
          item.productId === product.id && item.price === product.sellingPrice
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // إضافة منتج جديد
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.sellingPrice,
          quantity: 1,
          discount: 0, // خصم على الصنف
          total: product.sellingPrice,
        },
      ];
    });
  }, []);

  // تحديث كمية منتج
  const updateQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity < 1) return;
    setItems(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity, total: (item.price - item.discount) * newQuantity }
          : item
      )
    );
  }, []);

  // تحديث خصم على منتج
  const updateDiscount = useCallback((productId, discount) => {
    if (discount < 0) discount = 0;
    setItems(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, discount, total: (item.price - discount) * item.quantity }
          : item
      )
    );
  }, []);

  // حذف منتج
  const removeItem = useCallback((productId) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  }, []);

  // حساب الإجماليات
  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = items.reduce((sum, item) => sum + item.discount * item.quantity, 0);
    const total = subtotal - discount;
    return { subtotal, discount, total };
  }, [items]);

  // إعادة تعيين الفاتورة
  const resetSale = useCallback(() => {
    setItems([]);
    setPaymentMethod('cash');
    setCustomerId(null);
    setNotes('');
  }, []);

  return {
    items,
    paymentMethod,
    setPaymentMethod,
    customerId,
    setCustomerId,
    notes,
    setNotes,
    addItem,
    updateQuantity,
    updateDiscount,
    removeItem,
    totals,
    resetSale,
  };
};

export default useSale;
