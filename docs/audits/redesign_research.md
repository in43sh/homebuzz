# Redesign Research: Checkout

Research run on 2026-11-01 for Milestone 3 in [roadmap.md](../roadmap.md). This is the
**checkout slice** of [redesign_research_prompt.md](../redesign_research_prompt.md): the
cart, sign-in gate, order placement, confirmation, and order history. It is research
only. No application code was changed.

## How this was run

- **App:** a production build served locally (`next build`, then `next start`), driven in
  Chromium through browser automation at **1280px** and **375px**.
- **Users:** guest and customer (`demo@homebuzz.test`). The admin walkthrough was not
  run, because admin tasks are outside the checkout slice.
- **Evidence:** observed behavior (with screenshots in
  [redesign_research_assets/](redesign_research_assets/)) or `file:line` from the code.
  Each finding says which. A step is one click or one form input, counted from the home
  page.
- **Prior work, not repeated:** the five known accessibility findings are fixed
  ([roadmap.md](../roadmap.md), Milestone 2). Lighthouse performance is 99–100 and is
  treated as a budget to protect ([lighthouse_audit.md](lighthouse_audit.md)).

**Not run:** keyboard-only end-to-end checkout, a screen reader, browsers other than
Chromium, slow-network pending states, a real server failure, sign-up to completion
(it would create a user), Lighthouse, and the admin walkthrough. Pending states
("Placing order…") are cited from code, not observed.

**Test data left in the dev database:** orders #2 and #3 on the demo account, and stock
reduced by 2 (Glidden paint) and 1 (DeWalt drill). `npm run db:seed` resets it, but the
seed script deletes **every** table before reloading (`db/seed.ts:20-27`), including any
accounts or products you created yourself. I did not run it.

## Executive summary

The cart is fast and clear, and the order is correct and atomic. But "checkout" is a
single click that commits an order with no address, no delivery information, no review
step, and a status that claims payment. The five changes with the highest return:

1. **Add a real checkout step** (review, address, delivery method, then "Place order").
   Today the cart's "Checkout" button creates the order immediately (CK-01, CK-02).
2. **Make the result truthful and clear.** Show an explicit confirmation, and stop
   labeling unpaid orders "PAID" (CK-03, CK-04).
3. **Fix the guest path.** A guest who clicks Checkout lands on a bare sign-in page and,
   after signing in, on the account page instead of back at the cart: 9 steps instead
   of 4 (CK-05).
4. **Make stock problems preventable and actionable.** Shoppers never see stock, can put
   100 units in the cart when 99 exist, and then get an error that names no item
   (CK-06, CK-07).
5. **Announce errors and keep focus.** Errors and cart updates are invisible to screen
   readers, and focus is lost after a failed submit. Axe reports no violations here, so
   the automated tests will not catch it (CK-08).

## Keep as-is

- **Cart feedback.** "Added ✓" shows for about 1.2 seconds and the header count updates
  immediately. The +/- buttons update the line, tax, total, and header count at once.
- **Cart summary** shows subtotal, estimated tax, and total, and the order page matches
  it exactly.
- **Empty-cart copy:** "Your cart is empty. Browse the store and add a few things."
  with a "Shop the store" button.
- **Guest to account cart merge.** The guest cart survived sign-in (header count stayed
  at 1).
- **Atomic stock handling.** A failed checkout rolled back cleanly and the cart stayed
  intact (observed). Stock is decremented in one transaction (`lib/orders.ts:58-92`).
- **Prices are snapshotted** onto each order line (`lib/orders.ts:82-89`), so later price
  changes do not rewrite history.
- **Order privacy.** An order that is not yours returns 404 (`lib/orders.ts:139-143`).
- **Accessibility baseline.** Axe reports zero WCAG 2.1 A/AA violations on the cart with
  items, the order page, and sign-in and sign-up. No horizontal scroll at 375px.
- **Sign-in details:** the error message is specific without leaking which field was
  wrong, `autocomplete` attributes are correct, and sign-up moves focus to the first
  invalid field.
- **Performance budget:** Lighthouse performance at 99–100 must not drop.
- **Brand look.** Nothing here calls for visual churn.

## Baseline step counts

These are the numbers a redesign must be measured against.

| Task | Viewport | Steps | Path | Source |
| --- | --- | --- | --- | --- |
| Customer places an order | 1280 | **4** | Product, Add to cart, Cart, Checkout | Observed |
| Customer places an order with "Buy now" | 375 | **3** | Product, Buy now (lands on the cart), Checkout | Observed |
| Guest with an account places an order | 1280 | **9** | Product, Add to cart, Cart, Checkout (lands on bare sign-in), email, password, Sign in (lands on the account page), Cart, Checkout | Observed in two parts |
| Guest creating an account | any | **11** | The guest path, with 4 sign-up fields and Create account in place of the 3 sign-in steps | Form observed, rest from `AuthForm.tsx` |
| Find the order afterwards | 1280 | **1** | "Back to account" lists it with date, item count, status, and total | Observed |
| Find the order afterwards | 375 | **2** | Open menu, Account. The header account link is hidden below 640px (`Header.tsx:53-58`) | Code |

## Findings

Severity: **Blocker** (cannot complete, or cannot tell whether it worked), **Major**
(completes with wasted steps, confusion, or an unrecoverable-looking error), **Minor**
(polish). No finding is a Blocker. Effort: S, M, or L.

| ID | Area | Severity | Evidence | Principle or expectation | Recommendation | Effort |
| --- | --- | --- | --- | --- | --- | --- |
| CK-01 | Checkout | Major | The button labeled "Checkout" runs `placeOrderAction` directly (`CartControls.tsx:66-73`, `actions/orders.ts:7-20`). Observed: one click went from cart to a created order, with no review and no undo. Its pending label says "Placing order…", so the label and the action disagree | Error prevention and user control (Nielsen 5 and 3). Once payment is real, WCAG 3.3.4 requires a confirm or review step for financial commitments | Add a `/checkout` page with an order review and a button labeled "Place order". Rename the cart button "Continue to checkout" | L |
| CK-02 | Checkout | Major | The orders table has no address, shipping, or payment columns (`db/schema.ts:116-124`). Observed: no shipping line in the cart, none on the order page, no delivery expectation anywhere | Cart transparency and checkout conventions: shoppers expect to know where it ships, how much, and when | Add an address form and a delivery choice with fixed demo rates (Standard free, Express $12.99, tax 8%, per the roadmap decision). Store subtotal, shipping, tax, total, and an address snapshot on the order | L |
| CK-03 | Order status | Major | Every order is written as `"paid"` (`lib/orders.ts:79`) and shown as "PAID". Observed on orders #2 and #3, while the cart says "no payment is taken". The enum already has pending, paid, shipped, delivered, and cancelled (`db/schema.ts:16-22`), but only "paid" is ever used | Match between the system and the real world (Nielsen 2). Trust: a status that claims money moved when none did | Write a truthful status until payment exists (for example "placed"), and set "paid" only from the payment confirmation | S |
| CK-04 | Confirmation | Major | After placing an order the user lands on the plain order page. Observed: no "Order placed" message, no thank-you, no next steps, no email (none exists, per the roadmap) | Visibility of system status (Nielsen 1). A confirmation page is a checkout convention | Show a clear confirmation state with the order number, summary, and what happens next. The email belongs to Milestone 4 | M |
| CK-05 | Guest path | Major | Observed: Checkout sends a guest to a bare "Sign in" page with no explanation and no guest option (screenshot: [guest-checkout-lands-on-signin.png](redesign_research_assets/guest-checkout-lands-on-signin.png)). After signing in, `router.push("/account")` always runs (`AuthForm.tsx:79`), so the user must find the cart again. 9 steps instead of 4 | User control and efficiency of use. Forced account creation is a well-known checkout friction | Explain why ("Sign in to place your order"), and return to the cart or checkout after sign-in with a `returnTo` value. Decide separately whether to allow guest checkout (open question 2) | M |
| CK-06 | Stock errors | Major | Observed with 100 units in the cart against stock of 99: the banner reads "Some items are no longer in stock in the quantity you wanted" and names no item ([screenshot](redesign_research_assets/checkout-stock-error-desktop.png)). The server knows the titles (`lib/orders.ts:73-75`) but the action drops them (`actions/orders.ts:12`). No line is flagged. The banner stays after the cart is fixed, because `?error=stock` stays in the URL (observed after removing the line). Focus lands on the page body | Help users recognize, diagnose, and recover from errors (Nielsen 9) | Return the short items to the page, mark each line ("Only 99 left"), and clear the message once the cart is valid | M |
| CK-07 | Stock visibility | Major | Stock appears only in the admin table (`app/admin/products/page.tsx:38`). Observed: the product page says nothing about stock or delivery, and offers quantities 1–5 regardless. The cart accepts up to 999 (`lib/cart.ts:124`), so 100 units of a product with 99 were accepted | Error prevention (Nielsen 5). Stock handling: low-stock and out-of-stock cues on the product and cart | Show "In stock" or "Only N left" on the product page and cart, and cap quantities at available stock | M |
| CK-08 | Accessibility | Major | Observed: the sign-in error, the sign-up errors, and the stock banner have no `role="alert"`, and the fields have no `aria-invalid` or `aria-describedby`. Cart updates have no live region. Focus lands on the body after a failed sign-in and after the stock error. Axe reported no violations, so automated tests miss all of this | WCAG 4.1.3 Status Messages, 3.3.1 Error Identification, 3.3.3 Error Suggestion | Add `role="alert"` to error text, `aria-invalid` and `aria-describedby` to fields, a polite live region for cart changes, and move focus to the error or the first invalid field | S–M |
| CK-09 | Account | Major | Observed: the sign-in page has no "Forgot password?" link. A customer who forgets the password cannot finish checkout. Known in [roadmap.md](../roadmap.md) as a nice-to-have | Help and recovery. Blocks a purchase for those users | Fold into Milestone 4, since it needs email | L |
| CK-10 | Cart | Minor | Observed: "−" at quantity 1 removes the item silently and shows the empty cart ([screenshot](redesign_research_assets/cart-empty-after-minus-at-one.png)). "Clear cart" and "Remove" act immediately (`CartControls.tsx:47-80`). No undo | User control and freedom (Nielsen 3) | Disable "−" at 1 (Remove already exists), and add an undo or confirmation for "Clear cart" | S |
| CK-11 | Mobile | Minor | Observed at 375px: +/- are 32×32, Remove is 53×20, Clear cart is 293×20, directly below the main button ([screenshot](redesign_research_assets/cart-mobile-375.png)) | Touch targets. WCAG 2.2 sets a 24px minimum (the project targets 2.1), and 44px is the common guideline | Raise tappable controls to 44px and separate Clear cart from Checkout | S |
| CK-12 | Copy | Minor | The cart says "1 items" (`cart/page.tsx:41`). It tells shoppers "Stripe lands later" (`CartControls.tsx:82`), which is roadmap language. "Buy now" only goes to the cart (`ProductPurchase.tsx:49-57`) | Consistency and match with the real world | Pluralize correctly, use a customer-safe demo notice ("Demo store: no payment is taken"), and rename or fix "Buy now" | S |
| CK-13 | Order page | Minor | The date is formatted on the server with `toLocaleString()` (`orders/[id]/page.tsx:47`), so it shows the server's time zone, not the shopper's. Not reproduced, because the server and browser share a zone locally. The order stores only a total, and the page derives subtotal and tax from it with the global rate (`page.tsx:26-27`). I checked the arithmetic and found no rounding errors up to a $1,000 subtotal, but a rate change would silently rewrite old orders | Accuracy and consistency | Store subtotal, shipping, and tax on the order (with CK-02), and format dates for the viewer | S–M |
| CK-14 | State coverage | Minor | There is no `error.tsx`, `not-found.tsx`, or `loading.tsx` anywhere under `app/`. Observed: a missing order shows the default 404 with no link back ([screenshot](redesign_research_assets/missing-order-default-404-mobile.png)), and `/account/orders` is also a 404. A database failure during checkout rethrows (`lib/orders.ts:97`). The roadmap lists error pages as shipped | Designed empty, error, and loading states | Add a branded `not-found.tsx` with links back, an `error.tsx` for checkout, and `loading.tsx` for the cart and order pages | S–M |
| CK-15 | Forms | Minor | Observed: the 8-character password rule appears only after a failed submit, errors appear only on submit, and there is no show-password option | Forms: state requirements up front | Show the rule under the field and consider a show/hide toggle | S |
| CK-16 | Order lifecycle | Minor | Status never advances, and there is no cancel, re-order, receipt, or admin order screen (`app/admin` has products only, `actions/admin.ts` has two product actions). The Stitch checkout mockup promises "cancel within 1 hour", which does not exist | Honest promises. A scope decision | Remove the promise from the design, or build cancellation (it must restock). See open question 3 | L |

## Gap analysis

| Capability | Expected | In scope for a portfolio demo? | Minimal credible version |
| --- | --- | --- | --- |
| Address, review, and summary before commit | Yes | **Yes** | One `/checkout` page: address form, delivery radio, order summary, "Place order". If hosted Stripe Checkout is chosen, Stripe collects the address and only the review step is custom |
| Order confirmation | Yes | **Yes** | A confirmation state with order number, summary, next steps |
| Truthful order status | Yes | **Yes** | "Placed" until payment, with a visible status line |
| Stock visibility and limits | Yes | **Yes** | "Only N left" and quantity caps, as in the Stitch mockup |
| Order cancellation | Common | Decision | Either remove the mockup's promise or add a time-limited cancel that restocks |
| Re-order and receipts | Common | No | Skip |
| Saved addresses ("save this address" in the mockup) | Common | Decision | Needs an addresses table. Skip for v1 unless wanted |
| Admin order management | Expected for real operation | Later | A read-only orders list first |

## Prioritized roadmap

Each step is independently shippable and testable with `npm test` and `npm run test:e2e`.
Build the new pages to the "Base Hardware - Checkout" Stitch screen.

1. **Decisions first** (see Open questions). They change steps 4 and 5.
2. **Truthfulness and copy:** CK-03, CK-12, CK-10, CK-11, CK-15. All small, no schema
   change, and they remove the misleading parts today.
3. **Errors and stock:** CK-06, CK-07, CK-08, CK-14. This also closes the gap that axe
   cannot see: add keyboard and `role="alert"` assertions to the e2e suite.
4. **Guest path:** CK-05 with a `returnTo` value.
5. **Checkout page and data model:** CK-01, CK-02, CK-04, CK-13, including a migration
   (`npm run db:generate`, then `npm run db:migrate`).
6. **Payment:** Stripe, with CK-03 finishing as the webhook sets "paid". Plan it with
   step 5, because hosted Stripe Checkout collects the address itself.
7. **Milestone 4:** password reset and the confirmation email (CK-09), after step 5.

The existing backlog items (Lighthouse polish, rename leftovers) stay separate.

## Open questions

1. **Stripe hosted Checkout or a custom form?** Hosted means no custom address form.
   Custom means full control of the Stitch design.
2. **Allow guest checkout?** Or keep accounts required and just fix the path (CK-05)?
3. **Order cancellation:** build the 1-hour cancel from the mockup, or remove the line?
4. **Status wording** for orders before payment exists: "placed", "pending", or
   something else?
5. **Saved addresses:** include the mockup's "save this address" checkbox?
6. **Free shipping threshold:** the product mockup says "Free shipping over $75". Build
   it, or keep Standard free for all orders?
7. **"Buy now":** remove it, or make it a real one-step path into checkout?

## Verification plan

| Change | Before | After (target) | How to measure |
| --- | --- | --- | --- |
| Real checkout step (CK-01, CK-02) | 4 steps, order created on the cart's button | The cart button creates no order. An order appears only after "Place order". Steps stay at or under 6 | New e2e: clicking "Continue to checkout" leaves the order count unchanged. Step count by script |
| Truthful status and confirmation (CK-03, CK-04) | Status "PAID" with no payment, no confirmation message | A visible confirmation, and no "PAID" before payment | e2e assertion on the confirmation text and status. Axe scan of the new page |
| Guest path (CK-05) | 9 steps, 2 extra navigation steps after sign-in, no explanation | 0 extra navigation steps, and an explanatory message | e2e: guest checkout, sign in, assert the return to checkout |
| Stock errors (CK-06, CK-07) | Generic banner, stale after the fix, stock invisible | The banner names the item and available quantity and clears when fixed. "Only N left" is shown | e2e with a low-stock product (set directly in the test database) |
| Announced errors (CK-08) | No `role="alert"`, focus on the body | `getByRole('alert')` finds each error, and focus lands on the first invalid field or alert | Playwright role assertions, added to `keyboard.spec.ts` |
| Performance and accessibility budget | Lighthouse performance 99–100, axe 0 violations | No drop, and the new `/checkout` and confirmation pages added to the axe scan | Lighthouse, and `npm run test:e2e` |

## Evidence index

| Screenshot | Shows |
| --- | --- |
| [cart-desktop-guest.png](redesign_research_assets/cart-desktop-guest.png) | Guest cart: tax line, no shipping, "Stripe lands later" |
| [guest-checkout-lands-on-signin.png](redesign_research_assets/guest-checkout-lands-on-signin.png) | Checkout as a guest lands on a bare sign-in page |
| [signin-wrong-password.png](redesign_research_assets/signin-wrong-password.png) | Wrong-password error, no recovery link |
| [cart-empty-after-minus-at-one.png](redesign_research_assets/cart-empty-after-minus-at-one.png) | "−" at quantity 1 empties the cart |
| [order-page-after-checkout-desktop.png](redesign_research_assets/order-page-after-checkout-desktop.png) | Order page: "PAID", no confirmation |
| [order-page-after-checkout-mobile-375.png](redesign_research_assets/order-page-after-checkout-mobile-375.png) | Same, at 375px |
| [account-order-history-desktop.png](redesign_research_assets/account-order-history-desktop.png) | Order history on the account page |
| [checkout-stock-error-desktop.png](redesign_research_assets/checkout-stock-error-desktop.png) | Generic stock error banner |
| [cart-mobile-375.png](redesign_research_assets/cart-mobile-375.png) | Mobile cart and its small touch targets |
| [missing-order-default-404-mobile.png](redesign_research_assets/missing-order-default-404-mobile.png) | Default 404 for a missing order |
