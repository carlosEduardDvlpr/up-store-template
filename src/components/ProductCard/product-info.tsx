import { useProductCard } from '@/contexts/product-card-context';
import { useTokenContext } from '@/contexts/token-context';
import { formatCurrency } from '@/lib/utils';
import { Button } from '../ui/button';
import { useState } from 'react';
import { SignUpForm } from '../Forms/SignUp';
import { Dialog, DialogContent } from '../ui/dialog';
import { INSTALLMENTS, PIX_DISCOUNT_PERCENTAGE } from '@/data/constants';

export function ProductInfo() {
  const { product } = useProductCard();
  const { user, isLoading } = useTokenContext();
  const [showSignupModal, setShowSignupModal] = useState(false);

  const safeInstallments = INSTALLMENTS > 0 ? INSTALLMENTS : 1;
  const safePixDiscount =
    PIX_DISCOUNT_PERCENTAGE > 0 ? PIX_DISCOUNT_PERCENTAGE : 0;

  return (
    <div className="flex flex-1 flex-col pt-4">
      <div className="text-lg text-zinc-500" style={{ height: '1.2em' }}>
        <p
          className="line-clamp-1 max-w-full mx-auto text-[11px] ml-1 text-black font-serif"
          style={{
            maxHeight: '1.2em',
            lineHeight: '1.2em',
          }}
        >
          {product.title}
        </p>
      </div>
      <div className="flex flex-1 flex-col">
        {user && !isLoading ? (
          product.price_wholesale ? (
            <div className="space-y-1 px-1">
              <div className="flex flex-col">
                <p className="font-base text-sm">
                  {formatCurrency(product.price_wholesale)}
                </p>
                <p className="text-xs text-muted-foreground font-light">
                  {`em até ${safeInstallments}x de `}
                  {formatCurrency(
                    Number(product.price_wholesale) / INSTALLMENTS,
                  )}
                </p>
              </div>
              <p className="text-xs text-muted-foreground text-green-800 opacity-70">
                {formatCurrency(
                  product.price_wholesale * (1 - safePixDiscount),
                )}{' '}
                no PIX
              </p>
            </div>
          ) : (
            'SEM PREÇO'
          )
        ) : (
          <>
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowSignupModal(true);
              }}
              className="w-full bg-[#7cb89d] hover:bg-[#6ca88d] text-white h-9 text-xs font-light tracking-wide uppercase rounded-none mt-2"
            >
              Cadastre-se para ver o preço
            </Button>
          </>
        )}
      </div>
      <Dialog open={showSignupModal} onOpenChange={setShowSignupModal}>
        <DialogContent className="sm:max-w-2xl  md:max-w-[80vw] max-h-[90vh] overflow-y-auto">
          <SignUpForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
