# Misura quanto il cerchio di ogni ruota (img/<id>_wheel.png) è fuori asse rispetto alla gomma: cerca il centro che rende più simmetrico il disegno.
# Si usa guardando i valori con la varianza che cala molto (e le immagini ingrandite): poi si scrive in Street2D.WHEEL_FIX (street2d.js). Serve Pillow e numpy.
from PIL import Image
import numpy as np, glob, os
def samp(l,x,y):
    S=l.shape[0]; x0=int(np.floor(x-.5)); y0=int(np.floor(y-.5)); fx=x-.5-x0; fy=y-.5-y0
    x0=np.clip(x0,0,S-2); y0=np.clip(y0,0,S-2)
    return (l[y0,x0]*(1-fx)*(1-fy)+l[y0,x0+1]*fx*(1-fy)+l[y0+1,x0]*(1-fx)*fy+l[y0+1,x0+1]*fx*fy)
def best(f):
    w=np.array(Image.open(f).convert('RGBA')).astype(float); S=w.shape[0]; l=w[:,:,:3].mean(2)
    R=S/2; res={}
    for dx in np.arange(-5,5.01,0.5):
        for dy in np.arange(-5,5.01,0.5):
            cx=S/2+dx; cy=S/2+dy; tot=0
            for r in np.arange(0.18*R,0.62*R,0.5):
                n=max(12,int(2*np.pi*r)); th=np.linspace(0,2*np.pi,n,endpoint=False)
                v=np.array([samp(l,cx+r*np.cos(t),cy+r*np.sin(t)) for t in th]); tot+=v.var()
            res[(dx,dy)]=tot
    k=min(res,key=res.get); return k,res[k],res[(0,0)]
for f in sorted(glob.glob('img/*_wheel.png')):
    k,v,v0=best(f); print('%-9s migliore centro rispetto al centro immagine: (%+.1f,%+.1f)  varianza %.0f (al centro %.0f)'%(os.path.basename(f)[:-10],k[0],k[1],v,v0))
