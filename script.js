const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer=matchMedia('(pointer: fine)').matches;
document.getElementById('year').textContent=new Date().getFullYear();

const menuButton=document.querySelector('.menu-toggle');
menuButton.addEventListener('click',()=>{const open=document.body.classList.toggle('menu-open');menuButton.setAttribute('aria-expanded',String(open))});
document.querySelectorAll('#site-nav a').forEach(link=>link.addEventListener('click',()=>{document.body.classList.remove('menu-open');menuButton.setAttribute('aria-expanded','false')}));

const reveals=document.querySelectorAll('.reveal');
document.querySelectorAll('.hero .reveal').forEach(el=>el.classList.add('is-visible'));
if(reducedMotion)reveals.forEach(el=>el.classList.add('is-visible'));
else{const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -5% 0px'});reveals.forEach(el=>observer.observe(el))}

const countObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const target=Number(entry.target.dataset.count);if(reducedMotion)entry.target.textContent=target;else{const start=performance.now();const tick=now=>{const progress=Math.min((now-start)/1100,1);entry.target.textContent=Math.round(target*(1-Math.pow(1-progress,3)));if(progress<1)requestAnimationFrame(tick)};requestAnimationFrame(tick)}countObserver.unobserve(entry.target)}),{threshold:.7});
document.querySelectorAll('[data-count]').forEach(counter=>countObserver.observe(counter));

if(finePointer&&!reducedMotion){
  const hero=document.querySelector('.hero'),dot=document.querySelector('.cursor-dot'),ring=document.querySelector('.cursor-ring');let mouseX=innerWidth/2,mouseY=innerHeight/2,ringX=mouseX,ringY=mouseY;
  addEventListener('mousemove',event=>{mouseX=event.clientX;mouseY=event.clientY;dot.style.opacity=ring.style.opacity='1';dot.style.transform=`translate(${mouseX-2.5}px,${mouseY-2.5}px)`;const rect=hero.getBoundingClientRect();if(event.clientY>=rect.top&&event.clientY<=rect.bottom){hero.style.setProperty('--mouse-x',`${event.clientX}px`);hero.style.setProperty('--mouse-y',`${event.clientY-rect.top}px`)}});
  const follow=()=>{ringX+=(mouseX-ringX)*.14;ringY+=(mouseY-ringY)*.14;ring.style.transform=`translate(${ringX-16}px,${ringY-16}px)`;requestAnimationFrame(follow)};follow();
  document.querySelectorAll('a,button,.tilt').forEach(el=>{el.addEventListener('mouseenter',()=>ring.classList.add('is-hovering'));el.addEventListener('mouseleave',()=>ring.classList.remove('is-hovering'))});
  document.querySelectorAll('.tilt').forEach(card=>{card.addEventListener('mousemove',event=>{const r=card.getBoundingClientRect(),x=(event.clientX-r.left)/r.width-.5,y=(event.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${-y*4}deg) rotateY(${x*4}deg) translateY(-4px)`});card.addEventListener('mouseleave',()=>card.style.transform='')});
}

if(!reducedMotion)document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{const destination=document.querySelector(link.getAttribute('href'));if(!destination)return;event.preventDefault();const target=destination.getBoundingClientRect().top+scrollY,start=scrollY,distance=target-start,began=performance.now(),duration=Math.min(1100,Math.max(550,Math.abs(distance)*.45));const scrollFrame=now=>{const p=Math.min((now-began)/duration,1),ease=1-Math.pow(1-p,4);scrollTo(0,start+distance*ease);if(p<1)requestAnimationFrame(scrollFrame);else history.replaceState(null,'',link.getAttribute('href'))};requestAnimationFrame(scrollFrame)}));
