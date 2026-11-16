# Disegno di lato (muso a destra, sfondo chiaro) -> sprite del gioco: corpo, ruota, maschera della vernice e dati per GEN_DATA.
# Uso: python3 -I disegni_auto.py <cartella img del gioco> <cartella anteprime> <ruote.json> <cartella disegni> <elenco.json>
from PIL import Image
import numpy as np, json, sys, colorsys
from collections import deque
import os
W=json.load(open(sys.argv[3]))
OUT=sys.argv[1]; PREV=sys.argv[2]; ZIP=sys.argv[4]
LIST=json.load(open(sys.argv[5]))   # { id: [file, passo in metri] }
CARS={k:(f, tuple(W[f]['rw']), tuple(W[f]['fw']), W[f]['R'], wb) for k,(f,wb) in LIST.items()}
meta={}
for cid,(n,rw,fw,R,wb) in CARS.items():
    src=Image.open(os.path.join(ZIP,n)).convert('RGB'); A=np.asarray(src).astype(float); H0,W0,_=A.shape
    s=44*wb/(fw[0]-rw[0])
    lum0=A.mean(2); ys,xs=np.where(lum0<226); x0,x1,y0,y1=xs.min(),xs.max(),ys.min(),ys.max()
    cyw=(rw[1]+fw[1])/2
    # ritaglio: dal bordo dell'auto fino al fondo delle gomme
    top=y0-4; bot=int(cyw+R+3); left=x0-4; right=x1+4
    crop=src.crop((left,top,right,bot))
    w=round((right-left)*s); h=round((bot-top)*s)
    small=np.asarray(crop.resize((w,h),Image.BOX)).astype(float)
    wm=np.asarray(Image.fromarray(((np.asarray(crop).astype(float).mean(2)>224)*255).astype(np.uint8)).resize((w,h),Image.BOX))/255.0
    white=wm>0.5
    bg=np.zeros((h,w),bool); q=deque([(y,x) for y in range(h) for x in (0,w-1)]+[(y,x) for x in range(w) for y in (0,h-1)])
    while q:
        y,x=q.popleft()
        if 0<=y<h and 0<=x<w and not bg[y,x] and white[y,x]: bg[y,x]=True; q.extend([(y+1,x),(y-1,x),(y,x+1),(y,x-1)])
    rcx=(rw[0]-left)*s; fcx=(fw[0]-left)*s; wcy=(cyw-top)*s; Rs=R*s
    alpha=np.where(bg,0,255).astype(np.uint8)
    yy,xx=np.mgrid[0:h,0:w]
    inR=lambda cx,r: np.hypot(xx+0.5-cx,yy+0.5-wcy)<r
    shadow=(yy+0.5>wcy+Rs*0.72)&~inR(rcx,Rs+0.6)&~inR(fcx,Rs+0.6)
    alpha[shadow]=0
    lowwhite=(((yy+0.5>wcy+Rs*0.35)&(small.mean(2)>200))|((yy+0.5>wcy+Rs*0.7)&(small.mean(2)>165)))&~inR(rcx,Rs+0.6)&~inR(fcx,Rs+0.6)
    alpha[lowwhite]=0
    # puntini chiari sotto la linea scura delle minigonne: avanzi dello sfondo dentro l'ombra
    Ls=small.mean(2)
    for _ in range(3):
        above_dark=np.roll(Ls,1,0)<80; above_clear=np.roll(alpha,1,0)==0
        spot=(yy+0.5>wcy+Rs*0.4)&(Ls>140)&(above_dark|above_clear)&~inR(rcx,Rs+0.6)&~inR(fcx,Rs+0.6)&(alpha>0)
        alpha[spot]=0
    rgba=np.dstack([np.clip(small,0,255).astype(np.uint8),alpha])
    # ruota (anteriore) come sprite a parte; nel corpo i dischi delle ruote diventano trasparenti
    S=int(np.ceil(Rs))+1; wh=np.zeros((2*S,2*S,4),np.uint8)
    for j in range(2*S):
        for i in range(2*S):
            X=int(round(fcx-S+i)); Y=int(round(wcy-S+j))
            if 0<=X<w and 0<=Y<h and np.hypot(i+0.5-S,j+0.5-S)<Rs+0.3: wh[j,i,:3]=rgba[Y,X,:3]; wh[j,i,3]=255
    body=rgba.copy(); body[inR(rcx,Rs+0.4)|inR(fcx,Rs+0.4),3]=0
    # vernice: colore di riferimento al centro della portiera
    px=body[...,:3].astype(float); L=px.mean(2); mx=px.max(2); mn=px.min(2); sat=(mx-mn)/np.maximum(mx,1)
    dy0=int(wcy-Rs*1.0); ref=np.median(px[dy0-3:dy0+3, int(w*0.5)-6:int(w*0.5)+6].reshape(-1,3),0)
    rL=ref.mean(); rS=(ref.max()-ref.min())/max(ref.max(),1)
    if rS>0.2:
        rh=colorsys.rgb_to_hsv(*(ref/255))[0]
        hh=np.vectorize(lambda r,g,b: colorsys.rgb_to_hsv(r/255,g/255,b/255)[0])(px[...,0],px[...,1],px[...,2])
        dh=np.minimum(abs(hh-rh),1-abs(hh-rh))
        paint=(dh<0.06)&(sat>rS*0.45)&(L>rL*0.25)
    else:
        bluish=(px[...,2]-px[...,0])>(ref[2]-ref[0])+7
        paint=(sat<0.16)&~bluish&(L>rL*0.5)&(L<min(255,rL*1.35+25))
    paint&=body[...,3]>0
    # chiusura morfologica di 1 pixel: riempie i buchi della vernice (riflessi e sfumature)
    def sh(m,dy,dx): return np.roll(np.roll(m,dy,0),dx,1)
    dil=paint.copy()
    for dy,dx in ((1,0),(-1,0),(0,1),(0,-1)): dil|=sh(paint,dy,dx)
    clo=dil.copy()
    for dy,dx in ((1,0),(-1,0),(0,1),(0,-1)): clo&=sh(dil,dy,dx)
    okc=(body[...,3]>0)&(sat<0.3 if rS<=0.2 else True)&(L>25)
    paint|=clo&okc
    # finestrini (azzurrini/grigio-blu) per il pilota e lo sticker sul vetro
    win=((px[...,2]-px[...,0])>10)&(L>60)&(yy<wcy-Rs*1.2)&(body[...,3]>0)
    wy,wx=np.where(win)
    wx0,wx1,wy0=(int(np.percentile(wx,3)),int(np.percentile(wx,97)),int(np.percentile(wy,3))) if len(wx) else (int(w*0.3),int(w*0.7),12)
    # fanali posteriori (rossi) e fari (chiari) agli estremi
    red=(px[...,0]>140)&(px[...,1]<110)&(xx<w*0.12)&(body[...,3]>0)
    ry,rx=np.where(red); tail=[int(rx.mean()) if len(rx) else 3, int(ry.mean()) if len(ry) else int(wcy-Rs)]
    hl=(L>185)&(xx>w*0.9)&(yy>wcy-Rs*1.6)&(yy<wcy)&(body[...,3]>0)&(sat<0.35)
    hy_,hx_=np.where(hl); head=[int(hx_.mean()) if len(hx_) else w-4, int(hy_.mean()) if len(hy_) else int(wcy-Rs*0.9)]
    Image.fromarray(body,'RGBA').save(f'{OUT}/{cid}.png')
    Image.fromarray(wh,'RGBA').save(f'{OUT}/{cid}_wheel.png')
    Image.fromarray(np.dstack([np.full((h,w,3),255,np.uint8),(paint*255).astype(np.uint8)]),'RGBA').save(f'{OUT}/{cid}_paint.png')
    G=dict(w=w,h=h,wy=round(wcy-Rs,1),wr=round(Rs,1),ax=[round(rcx,1),round(fcx,1)],head=head,tail=[max(0,tail[0]-2),max(0,tail[1]-3),5,5],
           ex=[3,round(wcy+Rs*0.25)],hx=int(wx0+(wx1-wx0)*0.62),hy=int(wy0-9),refL=round(rL,1),ref=[int(v) for v in ref],
           slots=dict(st_door=[int(w*0.55),int(wcy-Rs*0.9),int(w*0.15),int(Rs*0.8)],st_rear=[int(rcx),int(wcy-Rs*1.55),int(Rs*1.4),int(Rs*0.7)],st_glass=[int(wx0+(wx1-wx0)*0.25),int(wy0+5),int(Rs*1.4),int(Rs*0.45)]),
           ws=S)
    meta[cid]=G
    # anteprima con i punti
    big=Image.fromarray(body,'RGBA').resize((w*4,h*4),Image.NEAREST); pv=Image.new('RGBA',big.size,(40,40,60,255)); pv.alpha_composite(big)
    whb=Image.fromarray(wh,'RGBA').resize((2*S*4,2*S*4),Image.NEAREST)
    for cx in (rcx,fcx): pv.alpha_composite(whb,(int((cx-S)*4),int((wcy-S)*4)))
    from PIL import ImageDraw
    d=ImageDraw.Draw(pv)
    for (x,y,c) in [(head[0],head[1],'yellow'),(tail[0],tail[1],'red'),(G['ex'][0],G['ex'][1],'orange'),(G['hx'],G['hy']+16,'magenta')]: d.ellipse([x*4-6,y*4-6,x*4+6,y*4+6],outline=c,width=2)
    for k,(x,y,mw,mh) in G['slots'].items(): d.rectangle([(x-mw/2)*4,(y-mh/2)*4,(x+mw/2)*4,(y+mh/2)*4],outline='cyan',width=1)
    pm=Image.fromarray((paint*255).astype(np.uint8)).resize((w*2,h*2),Image.NEAREST)
    canvas=Image.new('RGB',(w*4,h*4+h*2+4),(0,0,0)); canvas.paste(pv.convert('RGB'),(0,0)); canvas.paste(pm.convert('RGB'),(0,h*4+4))
    canvas.save(f'{PREV}/{cid}_prev.png')
    print(cid,'%dx%d'%(w,h),'R=%.1f'%Rs,'ruote',G['ax'],'y',G['wy'],'ref',G['ref'],'vernice px',int(paint.sum()))
json.dump(meta,open(f'{PREV}/meta.json','w'),indent=1)
