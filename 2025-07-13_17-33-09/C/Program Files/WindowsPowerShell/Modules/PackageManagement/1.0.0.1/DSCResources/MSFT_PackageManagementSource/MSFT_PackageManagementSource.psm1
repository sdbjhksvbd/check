ÿþ# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
 
 # 
 
 #   C o p y r i g h t   ( c )   M i c r o s o f t   C o r p o r a t i o n . 
 
 # 
 
 #   T h i s   P S   D S C   r e s o u r c e   e n a b l e s   r e g i s t e r   o r   u n r e g i s t e r   a   p a c k a g e   s o u r c e   t h r o u g h   D S C   G e t ,   S e t   a n d   T e s t   o p e r a t i o n s   o n   D S C   m a n a g e d   n o d e s . 
 
 # 
 
 # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
 
 
 
 I m p o r t - L o c a l i z e d D a t a   - B i n d i n g V a r i a b l e   L o c a l i z e d D a t a   - f i l e n a m e   M S F T _ P a c k a g e M a n a g e m e n t S o u r c e . s t r i n g s . p s d 1 
 
 
 
 I m p o r t - M o d u l e   - N a m e   " $ P S S c r i p t R o o t \ . . \ P a c k a g e M a n a g e m e n t D s c U t i l i t i e s . p s m 1 " 
 
 
 
 f u n c t i o n   G e t - T a r g e t R e s o u r c e 
 
 { 
 
         < # 
 
         . S Y N O P S I S 
 
 
 
         T h i s   D S C   r e s o u r c e   p r o v i d e s   a   m e c h a n i s m   t o   r e g i s t e r / u n r e g i s t e r   a   p a c k a g e   s o u r c e   o n   y o u r   c o m p u t e r .   
 
 
 
         G e t - T a r g e t R e s o u r c e   r e t u r n s   t h e   c u r r e n t   s t a t e   o f   t h e   r e s o u r c e . 
 
 
 
         . P A R A M E T E R   N a m e 
 
         S p e c i f i e s   t h e   n a m e   o f   t h e   p a c k a g e   s o u r c e   t o   b e   r e g i s t e r e d   o r   u n r e g i s t e r e d   o n   y o u r   s y s t e m . 
 
 
 
         . P A R A M E T E R   P r o v i d e r N a m e 
 
         S p e c i f i e s   t h e   n a m e   o f   t h e   P a c k a g e M a n a g e m e n t   p r o v i d e r   t h r o u g h   w h i c h   y o u   c a n   i n t e r o p   w i t h   t h e   p a c k a g e   s o u r c e . 
 
 
 
         . P A R A M E T E R   S o u r c e U r i 
 
         S p e c i f i e s   t h e   U r i   o f   t h e   p a c k a g e   s o u r c e . 
 
         # > 
 
 
 
         [ C m d l e t B i n d i n g ( ) ] 
 
         [ O u t p u t T y p e ( [ S y s t e m . C o l l e c t i o n s . H a s h t a b l e ] ) ] 
 
         p a r a m 
 
         ( 
 
                 [ p a r a m e t e r ( M a n d a t o r y   =   $ t r u e ) ] 
 
                 [ S y s t e m . S t r i n g ] 
 
                 $ N a m e , 
 
 
 
                 [ p a r a m e t e r ( M a n d a t o r y   =   $ t r u e ) ] 
 
                 [ S y s t e m . S t r i n g ] 
 
                 $ P r o v i d e r N a m e , 
 
 
 
                 [ p a r a m e t e r ( M a n d a t o r y   =   $ t r u e ) ] 
 
                 [ S y s t e m . S t r i n g ] 
 
                 $ S o u r c e U r i 
 
         ) 
 
 
 
         # i n i t i a l i z e   a   l o c a l   v a r 
 
         $ e n s u r e   =   " A b s e n t " 
 
 
 
         # S e t   t h e   i n s t a l l a t i o n   p o l i c y   b y   d e f a u l t ,   u n t r u s t e d .   
 
         $ i n s t a l l a t i o n P o l i c y   = " U n t r u s t e d " 
 
 
 
         $ P S B o u n d P a r a m e t e r s . A d d ( " L o c a t i o n " ,   $ S o u r c e U r i ) 
 
         $ P S B o u n d P a r a m e t e r s . R e m o v e ( " S o u r c e U r i " ) 
 
 
 
         # V a l i d a t e   U r i   a n d   a d d   L o c a t i o n   b e c a u s e   P a c k a g e M a n a g e m e n t   u s e s   L o c a t i o n   n o t   S o u r c e U r i .   
 
         # V a l i d a t e A r g u m e n t     - A r g u m e n t   $ P S B o u n d P a r a m e t e r s [ ' L o c a t i o n ' ]   - T y p e   ' P a c k a g e S o u r c e '   - P r o v i d e r N a m e   $ P r o v i d e r N a m e 
 
 
 
         W r i t e - V e r b o s e   - M e s s a g e   ( $ l o c a l i z e d D a t a . S t a r t G e t P a c k a g e S o u r c e   - f   $ ( $ N a m e ) ) 
 
 
 
         # c h e c k   i f   t h e   p a c k a g e   s o u r c e   a l r e a d y   r e g i s t e r e d   o n   t h e   c o m p u t e r 
 
         $ s o u r c e   =   P a c k a g e M a n a g e m e n t \ G e t - P a c k a g e S o u r c e   @ P S B o u n d P a r a m e t e r s   - F o r c e B o o t s t r a p   - E r r o r A c t i o n   S i l e n t l y C o n t i n u e   - W a r n i n g A c t i o n   S i l e n t l y C o n t i n u e     
 
                 
 
 
 
         i f   ( ( $ s o u r c e . c o u n t   - g t   0 )   - a n d   ( $ s o u r c e . I s R e g i s t e r e d ) ) 
 
         { 
 
                 W r i t e - V e r b o s e   - M e s s a g e   ( $ l o c a l i z e d D a t a . P a c k a g e S o u r c e F o u n d   - f   $ ( $ N a m e ) ) 
 
                 $ e n s u r e   =   " P r e s e n t " 
 
         } 
 
         e l s e 
 
         { 
 
                 W r i t e - V e r b o s e   - M e s s a g e   ( $ l o c a l i z e d D a t a . P a c k a g e S o u r c e N o t F o u n d   - f   $ ( $ N a m e ) ) 
 
         } 
 
 
 
         W r i t e - D e b u g   - M e s s a g e   " S o u r c e   $ ( $ N a m e )   i s   $ ( $ e n s u r e ) " 
 
                                                   
 
         
 
         i f   ( $ e n s u r e   - e q   ' A b s e n t ' ) 
 
         { 
 
                 r e t u r n   @ { 
 
                         E n s u r e               =   $ e n s u r e 
 
                         N a m e                   =   $ N a m e 
 
                         P r o v i d e r N a m e   =   $ P r o v i d e r N a m e 
 
                 } 
 
         } 
 
         e l s e 
 
         { 
 
                 # S o m e t i m e s   G e t - P a c k a g e S o u r c e   c a n   r e t u r n   d u p l i c a t e   e n t r i e s .   B e l o w   i s   t h e   w o r k a r o u n d   t o   t h e   b u g .   
 
                 # O n c e   t h e   b u g   g e t s   f i x e d ,   r e m o v e   t h e   b e l o w   i f   ( $ s o u r c e . c o u n t   - g t   1 )   b l o c k   
 
 
 
                 i f   ( $ s o u r c e . c o u n t   - g t   1 ) 
 
                 { 
 
                         $ s o u r c e   = $ s o u r c e [ 0 ] 
 
                 } 
 
               
 
                 i f   ( $ s o u r c e . I s T r u s t e d ) 
 
                 { 
 
                         $ i n s t a l l a t i o n P o l i c y   =   " T r u s t e d " 
 
                 } 
 
 
 
                 r e t u r n   @ { 
 
                         E n s u r e                           =   $ e n s u r e 
 
                         N a m e                               =   $ N a m e 
 
                         P r o v i d e r N a m e               =   $ P r o v i d e r N a m e 
 
                         S o u r c e U r i                     =   $ s o u r c e . L o c a t i o n 
 
                         I n s t a l l a t i o n P o l i c y   =   $ i n s t a l l a t i o n P o l i c y 
 
                 } 
 
         }   
 
 } 
 
 
 
 f u n c t i o n   T e s t - T a r g e t R e s o u r c e 
 
 { 
 
         < # 
 
         . S Y N O P S I S 
 
 
 
         T h i s   D S C   r e s o u r c e   p r o v i d e s   a   m e c h a n i s m   t o   r e g i s t e r / u n r e g i s t e r   a   p a c k a g e   s o u r c e   o n   y o u r   c o m p u t e r .   
 
 
 
         T e s t - T a r g e t R e s o u r c e   v a l i d a t e s   w h e t h e r   t h e   r e s o u r c e   i s   c u r r e n t l y   i n   t h e   d e s i r e d   s t a t e . 
 
 
 
         . P A R A M E T E R   N a m e 
 
         S p e c i f i e s   t h e   n a m e   o f   t h e   p a c k a g e   s o u r c e   t o   b e   r e g i s t e r e d   o r   u n r e g i s t e r e d   o n   y o u r   s y s t e m . 
 
 
 
         . P A R A M E T E R   P r o v i d e r N a m e 
 
         S p e c i f i e s   t h e   n a m e   o f   t h e   P a c k a g e M a n a g e m e n t   p r o v i d e r   t h r o u g h   w h i c h   y o u   c a n   i n t e r o p   w i t h   t h e   p a c k a g e   s o u r c e . 
 
 
 
         . P A R A M E T E R   S o u r c e U r i 
 
         S p e c i f i e s   t h e   U r i   o f   t h e   p a c k a g e   s o u r c e . 
 
 
 
         . P A R A M E T E R   E n s u r e 
 
         D e t e r m i n e s   w h e t h e r   t h e   p a c k a g e   s o u r c e   t o   b e   r e g i s t e r e d   o r   u n r e g i s t e r e d . 
 
 
 
         . P A R A M E T E R   S o u r c e C r e d e n t i a l 
 
         P r o v i d e s   a c c e s s   t o   t h e   p a c k a g e   o n   a   r e m o t e   s o u r c e .   
 
 
 
         . P A R A M E T E R   I n s t a l l a t i o n P o l i c y 
 
         D e t e r m i n e s   w h e t h e r   y o u   t r u s t   t h e   p a c k a g e  s   s o u r c e . 
 
         # > 
 
 
 
         [ C m d l e t B i n d i n g ( ) ] 
 
         [ O u t p u t T y p e ( [ S y s t e m . B o o l e a n ] ) ] 
 
         p a r a m 
 
         ( 
 
                 [ p a r a m e t e r ( M a n d a t o r y   =   $ t r u e ) ] 
 
                 [ S y s t e m . S t r i n g ] 
 
                 $ N a m e , 
 
 
 
                 [ p a r a m e t e r ( M a n d a t o r y   =   $ t r u e ) ] 
 
                 [ S y s t e m . S t r i n g ] 
 
                 $ P r o v i d e r N a m e , 
 
 
 
                 [ p a r a m e t e r ( M a n d a t o r y   =   $ t r u e ) ] 
 
                 [ S y s t e m . S t r i n g ] 
 
                 $ S o u r c e U r i , 
 
 
 
                 [ V a l i d a t e S e t ( " P r e s e n t " , " A b s e n t " ) ] 
 
                 [ S y s t e m . S t r i n g ] 
 
                 $ E n s u r e = " P r e s e n t " , 
 
 
 
                 [ S y s t e m . M a n a g e m e n t . A u t o m a t i o n . P S C r e d e n t i a l ] 
 
                 $ S o u r c e C r e d e n t i a l , 
 
 
 
                 [ V a l i d a t e S e t ( " T r u s t e d " , " U n t r u s t e d " ) ] 
 
                 [ S y s t e m . S t r i n g ] 
 
                 $ I n s t a l l a t i o n P o l i c y = " U n t r u s t e d " 
 
         ) 
 
 
 
         # G e t   t h e   c u r r e n t   s t a t u s   o f   t h e   p a c k a g e   s o u r c e   
 
         W r i t e - D e b u g   - M e s s a g e     " C a l l i n g   G e t - T a r g e t R e s o u r c e " 
 
 
 
         $ s t a t u s   =   G e t - T a r g e t R e s o u r c e   - N a m e   $ N a m e   - P r o v i d e r N a m e   $ P r o v i d e r N a m e   - S o u r c e U r i   $ S o u r c e U r i 
 
   
 
         i f ( $ s t a t u s . E n s u r e   - e q   $ E n s u r e ) 
 
         { 
 
                 
 
                 i f   ( $ s t a t u s . E n s u r e   - e q   " P r e s e n t " )   
 
                 { 
 
                         # C h e c k   i f   t h e   s o u r c e   l o c a t i o n   m a t c h e s .   A s   g e t - p a c k a g e   t a k e s   l o c a t i o n   ( s o u r c e U r i )   p a r a m e t e r ,   t h e   r e s u l t   f r o m   G e t - p a c k a g e   s h o u l d   
 
                         # b e l o n g   t o   t h e   p a r t i c u l a r   s o u r c e   l o c a t i o n .   B u t   c u r r e n t l y   i t   d o e s   n o t .   B e l o w   i s   t h e   w o r k a r o u n d . 
 
                         # 
 
                         i f   ( $ s t a t u s . S o u r c e U r i   - i n e   $ S o u r c e U r i )   
 
                         { 
 
                                 W r i t e - V e r b o s e   - M e s s a g e   ( $ l o c a l i z e d D a t a . N o t I n D e s i r e d S t a t e D u e t o L o c a t i o n M i s m a t c h   - f   $ ( $ N a m e ) ,   $ ( $ S o u r c e U r i ) ,   $ ( $ s t a t u s . S o u r c e U r i ) ) 
 
                                 r e t u r n   $ f a l s e   
 
                         }     
 
 
 
                         # C h e c k   i f   t h e   i n s t a l l a t i o n P o l i c y   m a t c h e s .   S o m e t i m e s   t h e   r e g i s t e r e d   s o u r c e   a n d   d e s i r e d   s o u r c e   c a n   b e   t h e   s a m e   e x c e p t   f o r   I n s t a l l a t i o n P o l i c y 
 
                         # 
 
                         i f   ( $ s t a t u s . I n s t a l l a t i o n P o l i c y   - i n e   $ I n s t a l l a t i o n P o l i c y ) 
 
                         { 
 
                                 W r i t e - V e r b o s e   - M e s s a g e   ( $ l o c a l i z e d D a t a . N o t I n D e s i r e d S t a t e D u e t o P o l i c y M i s m a t c h   - f   $ ( $ N a m e ) ,   $ ( $ I n s t a l l a t i o n P o l i c y ) ,   $ ( $ s t a t u s . I n s t a l l a t i o n P o l i c y ) ) 
 
                                 r e t u r n   $ f a l s e   
 
                         }                       
 
                 } 
 
 
 
                 W r i t e - V e r b o s e   - M e s s a g e   ( $ l o c a l i z e d D a t a . I n D e s i r e d S t a t e   - f   $ ( $ N a m e ) ,   $ ( $ E n s u r e ) ,   $ ( $ s t a t u s . E n s u r e ) )                                       
 
                 r e t u r n   $ t r u e 
 
         } 
 
         e l s e 
 
         { 
 
                 W r i t e - V e r b o s e   - M e s s a g e   ( $ l o c a l i z e d D a t a . N o t I n D e s i r e d S t a t e   - f   $ ( $ N a m e ) ,   $ ( $ E n s u r e ) ,   $ ( $ s t a t u s . E n s u r e ) ) 
 
                 r e t u r n   $ f a l s e 
 
         } 
 
 } 
 
 
 
 f u n c t i o n   S e t - T a r g e t R e s o u r c e 
 
 { 
 
         < # 
 
         . S Y N O P S I S 
 
 
 
         T h i s   D S C   r e s o u r c e   p r o v i d e s   a   m e c h a n i s m   t o   r e g i s t e r / u n r e g i s t e r   a   p a c k a g e   s o u r c e   o n   y o u r   c o m p u t e r .   
 
 
 
         S e t - T a r g e t R e s o u r c e   s e t s   t h e   r e s o u r c e   t o   t h e   d e s i r e d   s t a t e .   " M a k e   i t   s o " . 
 
 
 
         . P A R A M E T E R   N a m e 
 
         S p e c i f i e s   t h e   n a m e   o f   t h e   p a c k a g e   s o u r c e   t o   b e   r e g i s t e r e d   o r   u n r e g i s t e r e d   o n   y o u r   s y s t e m . 
 
 
 
         . P A R A M E T E R   P r o v i d e r N a m e 
 
         S p e c i f i e s   t h e   n a m e   o f   t h e   P a c k a g e M a n a g e m e n t   p r o v i d e r   t h r o u g h   w h i c h   y o u   c a n   i n t e r o p   w i t h   t h e   p a c k a g e   s o u r c e . 
 
 
 
         . P A R A M E T E R   S o u r c e U r i 
 
         S p e c i f i e s   t h e   U r i   o f   t h e   p a c k a g e   s o u r c e . 
 
 
 
         . P A R A M E T E R   E n s u r e 
 
         D e t e r m i n e s   w h e t h e r   t h e   p a c k a g e   s o u r c e   t o   b e   r e g i s t e r e d   o r   u n r e g i s t e r e d . 
 
 
 
         . P A R A M E T E R   S o u r c e C r e d e n t i a l 
 
         P r o v i d e s   a c c e s s   t o   t h e   p a c k a g e   o n   a   r e m o t e   s o u r c e .   
 
 
 
         . P A R A M E T E R   I n s t a l l a t i o n P o l i c y 
 
         D e t e r m i n e s   w h e t h e r   y o u   t r u s t   t h e   p a c k a g e  s   s o u r c e . 
 
         # > 
 
 
 
         [ C m d l e t B i n d i n g ( ) ] 
 
         p a r a m 
 
         ( 
 
                 [ p a r a m e t e r ( M a n d a t o r y   =   $ t r u e ) ] 
 
                 [ S y s t e m . S t r i n g ] 
 
                 $ N a m e , 
 
 
 
                 [ p a r a m e t e r ( M a n d a t o r y   =   $ t r u e ) ] 
 
                 [ S y s t e m . S t r i n g ] 
 
                 $ P r o v i d e r N a m e , 
 
 
 
                 [ p a r a m e t e r ( M a n d a t o r y   =   $ t r u e ) ] 
 
                 [ S y s t e m . S t r i n g ] 
 
                 $ S o u r c e U r i , 
 
 
 
                 [ V a l i d a t e S e t ( " P r e s e n t " , " A b s e n t " ) ] 
 
                 [ S y s t e m . S t r i n g ] 
 
                 $ E n s u r e = " P r e s e n t " , 
 
 
 
                 [ S y s t e m . M a n a g e m e n t . A u t o m a t i o n . P S C r e d e n t i a l ] 
 
                 $ S o u r c e C r e d e n t i a l , 
 
 
 
                 [ V a l i d a t e S e t ( " T r u s t e d " , " U n t r u s t e d " ) ] 
 
                 [ S y s t e m . S t r i n g ] 
 
                 $ I n s t a l l a t i o n P o l i c y = " U n t r u s t e d " 
 
         ) 
 
 
 
         # A d d   L o c a t i o n   b e c a u s e   P a c k a g e M a n a g e m e n t   u s e s   L o c a t i o n   n o t   S o u r c e U r i .   
 
         $ P S B o u n d P a r a m e t e r s . A d d ( " L o c a t i o n " ,   $ S o u r c e U r i ) 
 
 
 
         i f   ( $ P S B o u n d P a r a m e t e r s . C o n t a i n s K e y ( " S o u r c e C r e d e n t i a l " ) ) 
 
         { 
 
                 $ P S B o u n d P a r a m e t e r s . A d d ( " C r e d e n t i a l " ,   $ S o u r c e C r e d e n t i a l ) 
 
         } 
 
 
 
         i f   ( $ I n s t a l l a t i o n P o l i c y   - i e q   " T r u s t e d " ) 
 
         { 
 
                 $ P S B o u n d P a r a m e t e r s . A d d ( " T r u s t e d " ,   $ T r u e ) 
 
         } 
 
         e l s e 
 
         { 
 
                 $ P S B o u n d P a r a m e t e r s . A d d ( " T r u s t e d " ,   $ F a l s e ) 
 
         } 
 
         
 
 
 
         i f ( $ E n s u r e   - i e q   " P r e s e n t " ) 
 
         {       
 
                 # 
 
                 # W a r n   a   u s e r   a b o u t   t h e   i n s t a l l a t i o n   p o l i c y 
 
                 # 
 
                 W r i t e - W a r n i n g   - M e s s a g e   ( $ l o c a l i z e d D a t a . I n s t a l l a t i o n P o l i c y W a r n i n g   - f   $ ( $ N a m e ) ,   $ ( $ S o u r c e U r i ) ,   $ ( $ I n s t a l l a t i o n P o l i c y ) ) 
 
 
 
                 $ e x t r a c t e d A r g u m e n t s   =   E x t r a c t A r g u m e n t s   - F u n c t i o n B o u n d P a r a m e t e r s   $ P S B o u n d P a r a m e t e r s   ` 
 
                                                                                               - A r g u m e n t N a m e s   ( " N a m e " , " P r o v i d e r N a m e " ,   " L o c a t i o n " ,   " C r e d e n t i a l " ,   " T r u s t e d " )       
 
                 
 
                 W r i t e - V e r b o s e   - M e s s a g e   ( $ l o c a l i z e d D a t a . S t a r t R e g i s t e r P a c k a g e S o u r c e   - f   $ ( $ N a m e ) )   
 
 
 
                 i f   ( $ n a m e   - e q   " p s g a l l e r y " ) 
 
                 {                   
 
                         #   I n   W M F   5 . 0   R T M ,   w e   a r e   n o t   a b l e   t o   r e g i s t e r   ' p s g a l l e r y '   p a c k a g e   s o u r c e .   T h u s   l e t ' s   t r y   S e t - P S R e p o s i t o r y   t o   s e e   i f   w e   c a n 
 
                         #   u p d a t e   t h e   r e g i s t r a t i o n .   
 
                         
 
                         #   B e f o r e   c a l l i n g   t h e   S e t - P S R e p o s i t o r y   c m d l e t ,   w e   n e e d   t o   m a k e   s u r e   t h e   P S G a l l e r y   a l r e a d y   r e g i s t e r e d . 
 
 
 
                         $ p s g a l l e r y   =   P a c k a g e M a n a g e m e n t \ G e t - P a c k a g e S o u r c e   - n a m e   $ n a m e   - L o c a t i o n   $ S o u r c e U r i   - P r o v i d e r N a m e   $ P r o v i d e r N a m e   - E r r o r A c t i o n   S i l e n t l y C o n t i n u e   - W a r n i n g A c t i o n   S i l e n t l y C o n t i n u e 
 
 
 
                         i f (   $ p s g a l l e r y ) 
 
                         { 
 
                                 S e t - P S R e p o s i t o r y   - N a m e   $ n a m e   - S o u r c e L o c a t i o n   $ S o u r c e U r i   - I n s t a l l a t i o n P o l i c y   $ I n s t a l l a t i o n P o l i c y   - E r r o r V a r i a b l e   e v   
 
                         } 
 
                         e l s e 
 
                         { 
 
                                 #   T h e   f o l l o w i n g   w o r k s   i f   y o u   a r e   r u n n i n g   T P 5   o r   l a t e r 
 
                                 $ e x t r a c t e d A r g u m e n t s . R e m o v e ( " L o c a t i o n " ) 
 
                                 P a c k a g e M a n a g e m e n t \ R e g i s t e r - P a c k a g e S o u r c e   @ e x t r a c t e d A r g u m e n t s   - F o r c e   - E r r o r V a r i a b l e   e v     
 
 
 
                         } 
 
                 } 
 
                 e l s e 
 
                 {                                                                               
 
                         P a c k a g e M a n a g e m e n t \ R e g i s t e r - P a c k a g e S o u r c e   @ e x t r a c t e d A r g u m e n t s   - F o r c e   - E r r o r V a r i a b l e   e v     
 
                 } 
 
                         
 
                 i f ( $ n u l l   - n e   $ e v   - a n d   $ e v . C o u n t   - g t   0 ) 
 
                 { 
 
                         T h r o w E r r o r     - E x c e p t i o n N a m e   " S y s t e m . I n v a l i d O p e r a t i o n E x c e p t i o n "   ` 
 
                                                 - E x c e p t i o n M e s s a g e   ( $ l o c a l i z e d D a t a . R e g i s t e r F a i l e d   - f   $ N a m e ,   $ e v . E x c e p t i o n ) ` 
 
                                                 - E r r o r I d   " R e g i s t e r F a i l e d "   ` 
 
                                                 - E r r o r C a t e g o r y   I n v a l i d O p e r a t i o n                                     
 
                 } 
 
                 e l s e 
 
                 { 
 
                         W r i t e - V e r b o s e   - M e s s a g e   ( $ l o c a l i z e d D a t a . R e g i s t e r e d S u c c e s s   - f   $ ( $ N a m e ) )                       
 
                 }                                             
 
         } 
 
         # E n s u r e = A b s e n t 
 
         e l s e   
 
         { 
 
                 $ e x t r a c t e d A r g u m e n t s   =   E x t r a c t A r g u m e n t s   - F u n c t i o n B o u n d P a r a m e t e r s   $ P S B o u n d P a r a m e t e r s   ` 
 
                                                                                               - A r g u m e n t N a m e s   $ ( " N a m e " , " P r o v i d e r N a m e " ,   " L o c a t i o n " ,   " C r e d e n t i a l " )     
 
                                                                                                               
 
                 W r i t e - V e r b o s e   - M e s s a g e   ( $ l o c a l i z e d D a t a . S t a r t U n R e g i s t e r P a c k a g e S o u r c e   - f   $ ( $ N a m e ) )     
 
                                                   
 
                 P a c k a g e M a n a g e m e n t \ U n r e g i s t e r - P a c k a g e S o u r c e   @ e x t r a c t e d A r g u m e n t s   - F o r c e   - E r r o r V a r i a b l e   e v   
 
                 
 
                 i f ( $ n u l l   - n e   $ e v   - a n d   $ e v . C o u n t   - g t   0 ) 
 
                 { 
 
                         T h r o w E r r o r     - E x c e p t i o n N a m e   " S y s t e m . I n v a l i d O p e r a t i o n E x c e p t i o n "   ` 
 
                                                 - E x c e p t i o n M e s s a g e   ( $ l o c a l i z e d D a t a . U n R e g i s t e r F a i l e d   - f   $ N a m e ,   $ e v . E x c e p t i o n ) ` 
 
                                                 - E r r o r I d   " U n R e g i s t e r F a i l e d "   ` 
 
                                                 - E r r o r C a t e g o r y   I n v a l i d O p e r a t i o n               
 
                 } 
 
                 e l s e 
 
                 { 
 
                         W r i t e - V e r b o s e   - M e s s a g e   ( $ l o c a l i z e d D a t a . U n R e g i s t e r e d S u c c e s s   - f   $ ( $ N a m e ) )                         
 
                 }                                         
 
         }     
 
   } 
 
 
 
 E x p o r t - M o d u l e M e m b e r   - f u n c t i o n   G e t - T a r g e t R e s o u r c e ,   S e t - T a r g e t R e s o u r c e ,   T e s t - T a r g e t R e s o u r c e 
 
 
 
 