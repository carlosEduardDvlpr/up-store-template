## TODO

1. **Sign-Up Page**
   - Create a user-friendly sign-up page.

2. **Payment Integration**
   - Integrate PIX and Boleto payment options using Pagar.me.

3. **Menu Implementation**
   - Adjust the implementation of the MENU using category information.

4. **Search Bar Enhancement**
   - Improve the UI/UX of the search bar for a better user experience.

5. **Sign-In Button**
   - Adjust the sign-in button to display a sign-out option when the user is logged in.

6. **Google Tag Manager**
   - Implement TAGs using Google Tag Manager.

7. **Filters Implementation**
   - Add filters for the category and all product pages.

8. **Infinite Scroll**
   - Implement an infinite scroll option for product grids.

9. **Font Adjustments**
   - Adjust fonts across the site for a more polished and consistent appearance.

10. **Homepage Redesign**
    - Update the homepage layout and design for better UI and user engagement.

11. **Containerize Carousel**
   - Containerize Carousel to get props for reusing for other categories, getting category Title, description and other informations.

12. **Checkout Form**
- Ajust checkout form to properly register user address and phone (working in checkout/update-user-info page).

13. **Add Session data into Cart Context**
   - Fetch session and user information to push into cart context and cookie.

### Add events into NExtJS project annd configure GTM
https://morganfeeney.com/guides/nextjs/how-to-integrate-google-tag-manager-with-nextjs

### Add GTM events to DataLayer
1. User account
- [X] Login (When login form is send)
- [X] Sign up (When user send signup form)
2. Category
- [ ] Click in Category (click in carousel category or in menu)
- [X] View category items (When category page is viewed)
2. Caroussel
- [ ] View caroussel items (When caroussel products is viewed is viewed)
3. Product
- [X] Click in Item (Caroussel title or image click. Event: product_click)
- [X] View item details (When product page is viewed, is counting view to all the SKUs of the product with stock. Event: view_item)
- [X] Select Item (When color and size variants are selected. Event: select_item)
4. Cart
- [X] Add to cart (add to cart button)
- [X] Remove from cart (remove from cart button)
- [X] View cart (When cart button is clicked)
5. Checkout
- [ ] Begin Checkout (Checkout button is clicked)
- [ ] Select shipping info (when shipping address is selected)
- [ ] Select phone info (when phone is selected)
- [ ] Add payment info (Generate card token function)
- [ ] Purchase (when view order complete page)


Chat Project:
libs - openai, uuid, react-i18next, @radix-ui/react-dialog

    
