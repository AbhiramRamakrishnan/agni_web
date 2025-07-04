// import { useRef, useEffect, useState } from "react";
// import {
//   Renderer,
//   Camera,
//   Transform,
//   Plane,
//   Mesh,
//   Program,
//   Texture,
// } from "ogl";

// type GL = Renderer["gl"];

// function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
//   let timeout: number;
//   return function (this: any, ...args: Parameters<T>) {
//     window.clearTimeout(timeout);
//     timeout = window.setTimeout(() => func.apply(this, args), wait);
//   };
// }

// function lerp(p1: number, p2: number, t: number): number {
//   return p1 + (p2 - p1) * t;
// }

// interface ScreenSize {
//   width: number;
//   height: number;
// }

// interface Viewport {
//   width: number;
//   height: number;
// }

// interface MediaProps {
//   geometry: Plane;
//   gl: GL;
//   image: string;
//   index: number;
//   length: number;
//   renderer: Renderer;
//   scene: Transform;
//   screen: ScreenSize;
//   text: string;
//   description: string;
//   viewport: Viewport;
//   bend: number;
//   borderRadius?: number;
// }

// class Media {
//   extra: number = 0;
//   geometry: Plane;
//   gl: GL;
//   image: string;
//   index: number;
//   length: number;
//   renderer: Renderer;
//   scene: Transform;
//   screen: ScreenSize;
//   text: string;
//   description: string;
//   viewport: Viewport;
//   bend: number;
//   borderRadius: number;
//   program!: Program;
//   plane!: Mesh;
//   scale!: number;
//   padding!: number;
//   width!: number;
//   widthTotal!: number;
//   x!: number;
//   speed: number = 0;
//   isBefore: boolean = false;
//   isAfter: boolean = false;

//   constructor({
//     geometry,
//     gl,
//     image,
//     index,
//     length,
//     renderer,
//     scene,
//     screen,
//     text,
//     description,
//     viewport,
//     bend,
//     borderRadius = 0.08,
//   }: MediaProps) {
//     this.geometry = geometry;
//     this.gl = gl;
//     this.image = image;
//     this.index = index;
//     this.length = length;
//     this.renderer = renderer;
//     this.scene = scene;
//     this.screen = screen;
//     this.text = text;
//     this.description = description;
//     this.viewport = viewport;
//     this.bend = bend;
//     this.borderRadius = borderRadius;
//     this.createShader();
//     this.createMesh();
//     this.onResize();
//   }

//   createShader() {
//     const texture = new Texture(this.gl, { generateMipmaps: false });
//     this.program = new Program(this.gl, {
//       depthTest: false,
//       depthWrite: false,
//       vertex: `
//         precision highp float;
//         attribute vec3 position;
//         attribute vec2 uv;
//         uniform mat4 modelViewMatrix;
//         uniform mat4 projectionMatrix;
//         uniform float uTime;
//         uniform float uSpeed;
//         varying vec2 vUv;
//         void main() {
//           vUv = uv;
//           vec3 p = position;
//           p.z = (sin(p.x * 3.0 + uTime) * 0.8 + cos(p.y * 1.5 + uTime) * 0.8) * (0.05 + uSpeed * 0.3);
//           gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
//         }
//       `,
//       fragment: `
//         precision highp float;
//         uniform vec2 uImageSizes;
//         uniform vec2 uPlaneSizes;
//         uniform sampler2D tMap;
//         uniform float uBorderRadius;
//         varying vec2 vUv;
        
//         float roundedBoxSDF(vec2 p, vec2 b, float r) {
//           vec2 d = abs(p) - b;
//           return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
//         }
        
//         void main() {
//           vec2 ratio = vec2(
//             min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
//             min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
//           );
//           vec2 uv = vec2(
//             vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
//             vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
//           );
//           vec4 color = texture2D(tMap, uv);
          
//           // Mild gradient overlay from top to bottom
//           float gradientFactor = vUv.y;
//           vec3 gradientOverlay = mix(vec3(1.0), vec3(0.7), gradientFactor * 0.3);
//           color.rgb *= gradientOverlay;
          
//           float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
//           if(d > 0.0) {
//             discard;
//           }
          
//           gl_FragColor = vec4(color.rgb, 1.0);
//         }
//       `,
//       uniforms: {
//         tMap: { value: texture },
//         uPlaneSizes: { value: [0, 0] },
//         uImageSizes: { value: [0, 0] },
//         uSpeed: { value: 0 },
//         uTime: { value: 100 * Math.random() },
//         uBorderRadius: { value: this.borderRadius },
//       },
//       transparent: true,
//     });
//     const img = new Image();
//     img.crossOrigin = "anonymous";
//     img.src = this.image;
//     img.onload = () => {
//       texture.image = img;
//       this.program.uniforms.uImageSizes.value = [
//         img.naturalWidth,
//         img.naturalHeight,
//       ];
//     };
//   }

//   createMesh() {
//     this.plane = new Mesh(this.gl, {
//       geometry: this.geometry,
//       program: this.program,
//     });
//     this.plane.setParent(this.scene);
//   }

//   update(
//     scroll: { current: number; last: number },
//     direction: "right" | "left"
//   ) {
//     this.plane.position.x = this.x - scroll.current - this.extra;

//     const x = this.plane.position.x;
//     const H = this.viewport.width / 2;

//     if (this.bend === 0) {
//       this.plane.position.y = 0;
//       this.plane.rotation.z = 0;
//     } else {
//       const B_abs = Math.abs(this.bend);
//       const R = (H * H + B_abs * B_abs) / (2 * B_abs);
//       const effectiveX = Math.min(Math.abs(x), H);

//       const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
//       if (this.bend > 0) {
//         this.plane.position.y = -arc * 0.3; // Reduced curve for rectangular look
//         this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R) * 0.5;
//       } else {
//         this.plane.position.y = arc * 0.3;
//         this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R) * 0.5;
//       }
//     }

//     this.speed = scroll.current - scroll.last;
//     this.program.uniforms.uTime.value += 0.04;
//     this.program.uniforms.uSpeed.value = this.speed;

//     const planeOffset = this.plane.scale.x / 2;
//     const viewportOffset = this.viewport.width / 2;
//     this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
//     this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
//     if (direction === "right" && this.isBefore) {
//       this.extra -= this.widthTotal;
//       this.isBefore = this.isAfter = false;
//     }
//     if (direction === "left" && this.isAfter) {
//       this.extra += this.widthTotal;
//       this.isBefore = this.isAfter = false;
//     }
//   }

//   onResize({
//     screen,
//     viewport,
//   }: { screen?: ScreenSize; viewport?: Viewport } = {}) {
//     if (screen) this.screen = screen;
//     if (viewport) {
//       this.viewport = viewport;
//     }
//     this.scale = this.screen.height / 1200;
//     // Rectangular dimensions - wider and shorter
//     this.plane.scale.y =
//       (this.viewport.height * (500 * this.scale)) / this.screen.height;
//     this.plane.scale.x =
//       (this.viewport.width * (900 * this.scale)) / this.screen.width;
//     this.plane.program.uniforms.uPlaneSizes.value = [
//       this.plane.scale.x,
//       this.plane.scale.y,
//     ];
//     this.padding = 1.5; // Reduced padding for closer cards
//     this.width = this.plane.scale.x + this.padding;
//     this.widthTotal = this.width * this.length;
//     this.x = this.width * this.index;
//   }
// }

// interface AppConfig {
//   items?: { image: string; text: string; description: string }[];
//   bend?: number;
//   borderRadius?: number;
//   onActiveIndexChange?: (index: number) => void;
// }

// class App {
//   container: HTMLElement;
//   scroll: {
//     ease: number;
//     current: number;
//     target: number;
//     last: number;
//     position?: number;
//   };
//   onCheckDebounce: (...args: any[]) => void;
//   renderer!: Renderer;
//   gl!: GL;
//   camera!: Camera;
//   scene!: Transform;
//   planeGeometry!: Plane;
//   medias: Media[] = [];
//   mediasImages: { image: string; text: string; description: string }[] = [];
//   screen!: { width: number; height: number };
//   viewport!: { width: number; height: number };
//   raf: number = 0;
//   onActiveIndexChange?: (index: number) => void;

//   boundOnResize!: () => void;
//   boundOnWheel!: () => void;
//   boundOnTouchDown!: (e: MouseEvent | TouchEvent) => void;
//   boundOnTouchMove!: (e: MouseEvent | TouchEvent) => void;
//   boundOnTouchUp!: () => void;

//   isDown: boolean = false;
//   start: number = 0;

//   constructor(
//     container: HTMLElement,
//     {
//       items,
//       bend = 2,
//       borderRadius = 0.08,
//       onActiveIndexChange,
//     }: AppConfig
//   ) {
//     document.documentElement.classList.remove("no-js");
//     this.container = container;
//     this.scroll = { ease: 0.08, current: 0, target: 0, last: 0 };
//     this.onCheckDebounce = debounce(this.onCheck.bind(this), 200);
//     this.onActiveIndexChange = onActiveIndexChange;
//     this.createRenderer();
//     this.createCamera();
//     this.createScene();
//     this.onResize();
//     this.createGeometry();
//     this.createMedias(items, bend, borderRadius);
//     this.update();
//     this.addEventListeners();
//   }

//   createRenderer() {
//     this.renderer = new Renderer({ alpha: true });
//     this.gl = this.renderer.gl;
//     this.gl.clearColor(0, 0, 0, 0);
//     this.container.appendChild(this.renderer.gl.canvas as HTMLCanvasElement);
//   }

//   createCamera() {
//     this.camera = new Camera(this.gl);
//     this.camera.fov = 45;
//     this.camera.position.z = 20;
//   }

//   createScene() {
//     this.scene = new Transform();
//   }

//   createGeometry() {
//     this.planeGeometry = new Plane(this.gl, {
//       heightSegments: 30,
//       widthSegments: 60,
//     });
//   }

//   createMedias(
//     items: { image: string; text: string; description: string }[] | undefined,
//     bend: number = 2,
//     borderRadius: number
//   ) {
//     const defaultItems = [
//       {
//         image: `https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800`,
//         text: "Mountain Vista",
//         description: "Breathtaking mountain landscapes captured in golden hour light"
//       },
//       {
//         image: `https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=800`,
//         text: "Ocean Waves",
//         description: "Powerful waves crashing against rugged coastal rocks"
//       },
//       {
//         image: `https://images.pexels.com/photos/355952/pexels-photo-355952.jpeg?auto=compress&cs=tinysrgb&w=800`,
//         text: "City Lights",
//         description: "Urban skyline illuminated by thousands of city lights at night"
//       },
//       {
//         image: `https://images.pexels.com/photos/132037/pexels-photo-132037.jpeg?auto=compress&cs=tinysrgb&w=800`,
//         text: "Forest Path",
//         description: "Mysterious forest trail winding through ancient trees"
//       },
//       {
//         image: `https://images.pexels.com/photos/371589/pexels-photo-371589.jpeg?auto=compress&cs=tinysrgb&w=800`,
//         text: "Desert Dunes",
//         description: "Endless sand dunes sculpted by wind and time"
//       },
//       {
//         image: `https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&w=800`,
//         text: "Lake Reflection",
//         description: "Perfect mirror reflections on a pristine mountain lake"
//       },
//       {
//         image: `https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800`,
//         text: "Autumn Forest",
//         description: "Golden autumn leaves creating a magical forest canopy"
//       },
//       {
//         image: `https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=800`,
//         text: "Starry Night",
//         description: "Brilliant stars illuminating the peaceful night sky"
//       },
//     ];
//     const galleryItems = items && items.length ? items : defaultItems;
//     this.mediasImages = galleryItems;
//     this.medias = this.mediasImages.map((data, index) => {
//       return new Media({
//         geometry: this.planeGeometry,
//         gl: this.gl,
//         image: data.image,
//         index,
//         length: this.mediasImages.length,
//         renderer: this.renderer,
//         scene: this.scene,
//         screen: this.screen,
//         text: data.text,
//         description: data.description,
//         viewport: this.viewport,
//         bend,
//         borderRadius,
//       });
//     });
//   }

//   onTouchDown(e: MouseEvent | TouchEvent) {
//     this.isDown = true;
//     this.scroll.position = this.scroll.current;
//     this.start = "touches" in e ? e.touches[0].clientX : e.clientX;
//   }

//   onTouchMove(e: MouseEvent | TouchEvent) {
//     if (!this.isDown) return;
//     const x = "touches" in e ? e.touches[0].clientX : e.clientX;
//     const distance = (this.start - x) * 0.08;
//     this.scroll.target = (this.scroll.position ?? 0) + distance;
//   }

//   onTouchUp() {
//     this.isDown = false;
//     this.onCheck();
//   }

//   onWheel() {
//     this.scroll.target += 1.5;
//     this.onCheckDebounce();
//   }

//   onCheck() {
//     if (!this.medias || !this.medias[0]) return;
//     const width = this.medias[0].width;
//     const itemIndex = Math.round(Math.abs(this.scroll.target) / width) % this.mediasImages.length;
//     const item = width * Math.round(Math.abs(this.scroll.target) / width);
//     this.scroll.target = this.scroll.target < 0 ? -item : item;
    
//     if (this.onActiveIndexChange) {
//       this.onActiveIndexChange(itemIndex);
//     }
//   }

//   goToIndex(index: number) {
//     const width = this.medias[0].width;
//     this.scroll.target = width * index;
//     if (this.onActiveIndexChange) {
//       this.onActiveIndexChange(index);
//     }
//   }

//   onResize() {
//     this.screen = {
//       width: this.container.clientWidth,
//       height: this.container.clientHeight,
//     };
//     this.renderer.setSize(this.screen.width, this.screen.height);
//     this.camera.perspective({
//       aspect: this.screen.width / this.screen.height,
//     });
//     const fov = (this.camera.fov * Math.PI) / 180;
//     const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
//     const width = height * this.camera.aspect;
//     this.viewport = { width, height };
//     if (this.medias) {
//       this.medias.forEach((media) =>
//         media.onResize({ screen: this.screen, viewport: this.viewport })
//       );
//     }
//   }

//   update() {
//     this.scroll.current = lerp(
//       this.scroll.current,
//       this.scroll.target,
//       this.scroll.ease
//     );
//     const direction = this.scroll.current > this.scroll.last ? "right" : "left";
//     if (this.medias) {
//       this.medias.forEach((media) => media.update(this.scroll, direction));
//     }
//     this.renderer.render({ scene: this.scene, camera: this.camera });
//     this.scroll.last = this.scroll.current;
//     this.raf = window.requestAnimationFrame(this.update.bind(this));
//   }

//   addEventListeners() {
//     this.boundOnResize = this.onResize.bind(this);
//     this.boundOnWheel = this.onWheel.bind(this);
//     this.boundOnTouchDown = this.onTouchDown.bind(this);
//     this.boundOnTouchMove = this.onTouchMove.bind(this);
//     this.boundOnTouchUp = this.onTouchUp.bind(this);
//     window.addEventListener("resize", this.boundOnResize);
//     window.addEventListener("mousewheel", this.boundOnWheel);
//     window.addEventListener("wheel", this.boundOnWheel);
//     window.addEventListener("mousedown", this.boundOnTouchDown);
//     window.addEventListener("mousemove", this.boundOnTouchMove);
//     window.addEventListener("mouseup", this.boundOnTouchUp);
//     window.addEventListener("touchstart", this.boundOnTouchDown);
//     window.addEventListener("touchmove", this.boundOnTouchMove);
//     window.addEventListener("touchend", this.boundOnTouchUp);
//   }

//   destroy() {
//     window.cancelAnimationFrame(this.raf);
//     window.removeEventListener("resize", this.boundOnResize);
//     window.removeEventListener("mousewheel", this.boundOnWheel);
//     window.removeEventListener("wheel", this.boundOnWheel);
//     window.removeEventListener("mousedown", this.boundOnTouchDown);
//     window.removeEventListener("mousemove", this.boundOnTouchMove);
//     window.removeEventListener("mouseup", this.boundOnTouchUp);
//     window.removeEventListener("touchstart", this.boundOnTouchDown);
//     window.removeEventListener("touchmove", this.boundOnTouchMove);
//     window.removeEventListener("touchend", this.boundOnTouchUp);
//     if (
//       this.renderer &&
//       this.renderer.gl &&
//       this.renderer.gl.canvas.parentNode
//     ) {
//       this.renderer.gl.canvas.parentNode.removeChild(
//         this.renderer.gl.canvas as HTMLCanvasElement
//       );
//     }
//   }
// }

// interface CircularGalleryProps {
//   items?: { image: string; text: string; description: string }[];
//   bend?: number;
//   borderRadius?: number;
// }

// export default function CircularGallery({
//   items,
//   bend = 2,
//   borderRadius = 0.08,
// }: CircularGalleryProps) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const appRef = useRef<App | null>(null);

//   // defaultItems must be defined before galleryItems and state!
//   const defaultItems = [
//     {
//       image: `https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800`,
//       text: "Mountain Vista",
//       description: "Breathtaking mountain landscapes captured in golden hour light"
//     },
//     {
//       image: `https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=800`,
//       text: "Ocean Waves",
//       description: "Powerful waves crashing against rugged coastal rocks"
//     },
//     {
//       image: `https://images.pexels.com/photos/355952/pexels-photo-355952.jpeg?auto=compress&cs=tinysrgb&w=800`,
//       text: "City Lights",
//       description: "Urban skyline illuminated by thousands of city lights at night"
//     },
//     {
//       image: `https://images.pexels.com/photos/132037/pexels-photo-132037.jpeg?auto=compress&cs=tinysrgb&w=800`,
//       text: "Forest Path",
//       description: "Mysterious forest trail winding through ancient trees"
//     },
//     {
//       image: `https://images.pexels.com/photos/371589/pexels-photo-371589.jpeg?auto=compress&cs=tinysrgb&w=800`,
//       text: "Desert Dunes",
//       description: "Endless sand dunes sculpted by wind and time"
//     },
//     {
//       image: `https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&w=800`,
//       text: "Lake Reflection",
//       description: "Perfect mirror reflections on a pristine mountain lake"
//     },
//     {
//       image: `https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800`,
//       text: "Autumn Forest",
//       description: "Golden autumn leaves creating a magical forest canopy"
//     },
//     {
//       image: `https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=800`,
//       text: "Starry Night",
//       description: "Brilliant stars illuminating the peaceful night sky"
//     },
//   ];

//   const galleryItems = items && items.length ? items : defaultItems;

//   // Initial state: always valid
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [activeItem, setActiveItem] = useState(galleryItems[0]);

//   useEffect(() => {
//     if (!containerRef.current) return;
//     appRef.current = new App(containerRef.current, {
//       items: galleryItems,
//       bend,
//       borderRadius,
//       onActiveIndexChange: (index) => {
//         setActiveIndex(index);
//         setActiveItem(galleryItems[index] ?? defaultItems[0]);
//       },
//     });
//     return () => {
//       appRef.current?.destroy();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [items, bend, borderRadius]);

//   const handleDotClick = (index: number) => {
//     if (appRef.current) {
//       appRef.current.goToIndex(index);
//     }
//   };

//   return (
//     <div className="relative w-full min-h-[700px] md:min-h-[850px] flex flex-col justify-center items-center bg-white">
//       {/* Title Overlay - Fixed Position */}
//       <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10 text-center">
//         <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
//           {activeItem?.text || ""}
//         </h2>
//       </div>

//       {/* Gallery Container */}
//       <div
//         className="w-full h-full min-h-[500px] overflow-hidden cursor-grab active:cursor-grabbing relative flex-1"
//         ref={containerRef}
//       >
//         {/* Description Overlay - Inside Card at Bottom */}
//         <div className="absolute left-1/2 bottom-4 transform -translate-x-1/2 z-20 pointer-events-none w-[75%] max-w-[360px]">
//           <p className="text-white text-[11px] leading-snug text-center font-medium drop-shadow-lg bg-black/50 px-2 py-1 rounded-md break-words overflow-hidden text-ellipsis">
//             {activeItem?.description || ""}
//           </p>
//         </div>
//       </div>

//       {/* Flat Semicircle Navigation */}
//       <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
//         <div 
//           className="flex items-center justify-center px-8 py-3"
//           style={{
//             background: 'transparent',
//             borderRadius: '60px',
//             transform: 'perspective(200px) rotateX(25deg)',
//             transformStyle: 'preserve-3d',
//           }}
//         >
//           <div className="flex items-center justify-center space-x-4">
//             {galleryItems.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => handleDotClick(index)}
//                 className={`rounded-full transition-all duration-300 hover:scale-110 ${
//                   index === activeIndex
//                     ? 'shadow-lg scale-125'
//                     : 'hover:scale-110'
//                 }`}
//                 style={{
//                   width: index === activeIndex ? '28px' : '12px',
//                   height: '12px',
//                   backgroundColor: index === activeIndex ? '#118449' : 'rgba(17, 132, 73, 0.4)',
//                 }}
//                 aria-label={`Go to slide ${index + 1}`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// import { useRef, useEffect } from "react";
// import {
//   Renderer,
//   Camera,
//   Transform,
//   Plane,
//   Mesh,
//   Program,
//   Texture,
// } from "ogl";

// type GL = Renderer["gl"];

// function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
//   let timeout: number;
//   return function (this: any, ...args: Parameters<T>) {
//     window.clearTimeout(timeout);
//     timeout = window.setTimeout(() => func.apply(this, args), wait);
//   };
// }

// function lerp(p1: number, p2: number, t: number): number {
//   return p1 + (p2 - p1) * t;
// }

// function autoBind(instance: any): void {
//   const proto = Object.getPrototypeOf(instance);
//   Object.getOwnPropertyNames(proto).forEach((key) => {
//     if (key !== "constructor" && typeof instance[key] === "function") {
//       instance[key] = instance[key].bind(instance);
//     }
//   });
// }

// function getFontSize(font: string): number {
//   const match = font.match(/(\d+)px/);
//   return match ? parseInt(match[1], 10) : 30;
// }

// function createTextTexture(
//   gl: GL,
//   text: string,
//   font: string = "bold 30px monospace",
//   color: string = "black"
// ): { texture: Texture; width: number; height: number } {
//   const canvas = document.createElement("canvas");
//   const context = canvas.getContext("2d");
//   if (!context) throw new Error("Could not get 2d context");

//   context.font = font;
//   const metrics = context.measureText(text);
//   const textWidth = Math.ceil(metrics.width);
//   const fontSize = getFontSize(font);
//   const textHeight = Math.ceil(fontSize * 1.2);

//   canvas.width = textWidth + 20;
//   canvas.height = textHeight + 20;

//   context.font = font;
//   context.fillStyle = color;
//   context.textBaseline = "middle";
//   context.textAlign = "center";
//   context.clearRect(0, 0, canvas.width, canvas.height);
//   context.fillText(text, canvas.width / 2, canvas.height / 2);

//   const texture = new Texture(gl, { generateMipmaps: false });
//   texture.image = canvas;
//   return { texture, width: canvas.width, height: canvas.height };
// }

// interface TitleProps {
//   gl: GL;
//   plane: Mesh;
//   renderer: Renderer;
//   text: string;
//   textColor?: string;
//   font?: string;
//   offsetY?: number;
// }

// class Title {
//   gl: GL;
//   plane: Mesh;
//   renderer: Renderer;
//   text: string;
//   textColor: string;
//   font: string;
//   mesh!: Mesh;
//   offsetY: number;

//   constructor({
//     gl,
//     plane,
//     renderer,
//     text,
//     textColor = "#0f9952", // changed default color to green 
//     font = "30px sans-serif",
//     offsetY = 0,
//   }: TitleProps) {
//     autoBind(this);
//     this.gl = gl;
//     this.plane = plane;
//     this.renderer = renderer;
//     this.text = text;
//     this.textColor = textColor;
//     this.font = font;
//     this.offsetY = offsetY;
//     this.createMesh();
//   }

//   createMesh() {
//     const { texture, width, height } = createTextTexture(
//       this.gl,
//       this.text,
//       this.font,
//       this.textColor
//     );
//     const geometry = new Plane(this.gl);
//     const program = new Program(this.gl, {
//       vertex: `
//         attribute vec3 position;
//         attribute vec2 uv;
//         uniform mat4 modelViewMatrix;
//         uniform mat4 projectionMatrix;
//         varying vec2 vUv;
//         void main() {
//           vUv = uv;
//           gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//         }
//       `,
//       fragment: `
//         precision highp float;
//         uniform sampler2D tMap;
//         varying vec2 vUv;
//         void main() {
//           vec4 color = texture2D(tMap, vUv);
//           if (color.a < 0.1) discard;
//           gl_FragColor = color;
//         }
//       `,
//       uniforms: { tMap: { value: texture } },
//       transparent: true,
//     });
//     this.mesh = new Mesh(this.gl, { geometry, program });
//     const aspect = width / height;
//     const textHeightScaled = this.plane.scale.y * 0.15;
//     const textWidthScaled = textHeightScaled * aspect;
//     this.mesh.scale.set(textWidthScaled, textHeightScaled, 1);
//     this.mesh.position.y =
//       -this.plane.scale.y * 0.5 - textHeightScaled * 0.5 - 0.05 + this.offsetY;
//     this.mesh.setParent(this.plane);
//   }
// }

// interface DescriptionProps {
//   gl: GL;
//   plane: Mesh;
//   renderer: Renderer;
//   description: string;
//   textColor?: string;
//   font?: string;
//   offsetY?: number;
// }

// class Description {
//   gl: GL;
//   plane: Mesh;
//   renderer: Renderer;
//   description: string;
//   textColor: string;
//   font: string;
//   mesh!: Mesh;
//   offsetY: number;

//   constructor({
//     gl,
//     plane,
//     renderer,
//     description,
//     textColor = "#8a8a8a",
//     font = "normal 18px sans-serif",
//     offsetY = 0,
//   }: DescriptionProps) {
//     autoBind(this);
//     this.gl = gl;
//     this.plane = plane;
//     this.renderer = renderer;
//     this.description = description;
//     this.textColor = textColor;
//     this.font = font;
//     this.offsetY = offsetY;
//     this.createMesh();
//   }

//   createMesh() {
//     const { texture, width, height } = createTextTexture(
//       this.gl,
//       this.description,
//       this.font,
//       this.textColor
//     );
//     const geometry = new Plane(this.gl);
//     const program = new Program(this.gl, {
//       vertex: `
//         attribute vec3 position;
//         attribute vec2 uv;
//         uniform mat4 modelViewMatrix;
//         uniform mat4 projectionMatrix;
//         varying vec2 vUv;
//         void main() {
//           vUv = uv;
//           gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//         }
//       `,
//       fragment: `
//         precision highp float;
//         uniform sampler2D tMap;
//         varying vec2 vUv;
//         void main() {
//           vec4 color = texture2D(tMap, vUv);
//           if (color.a < 0.1) discard;
//           gl_FragColor = color;
//         }
//       `,
//       uniforms: { tMap: { value: texture } },
//       transparent: true,
//     });
//     this.mesh = new Mesh(this.gl, { geometry, program });
//     const aspect = width / height;
//     const descHeightScaled = this.plane.scale.y * 0.20;
//     const descWidthScaled = this.plane.scale.x * 0.8;
//     this.mesh.scale.set(descWidthScaled, descHeightScaled, 1);
//     // Decreased the gap between title and description by reducing the offset from -0.09 to -0.015
//     this.mesh.position.y =
//       -this.plane.scale.y * 0.5 - descHeightScaled * 2 - 0.015 + this.offsetY;
//     this.mesh.setParent(this.plane);
//   }
// }

// interface ScreenSize {
//   width: number;
//   height: number;
// }

// interface Viewport {
//   width: number;
//   height: number;
// }

// interface MediaProps {
//   geometry: Plane;
//   gl: GL;
//   image: string;
//   index: number;
//   length: number;
//   renderer: Renderer;
//   scene: Transform;
//   screen: ScreenSize;
//   text: string;
//   description?: string;
//   viewport: Viewport;
//   bend: number;
//   textColor: string;
//   borderRadius?: number;
//   font?: string;
// }

// class Media {
//   extra: number = 0;
//   geometry: Plane;
//   gl: GL;
//   image: string;
//   index: number;
//   length: number;
//   renderer: Renderer;
//   scene: Transform;
//   screen: ScreenSize;
//   text: string;
//   description?: string;
//   viewport: Viewport;
//   bend: number;
//   textColor: string;
//   borderRadius: number;
//   font?: string;
//   program!: Program;
//   plane!: Mesh;
//   title!: Title;
//   descriptionObj?: Description;
//   scale!: number;
//   padding!: number;
//   width!: number;
//   widthTotal!: number;
//   x!: number;
//   speed: number = 0;
//   isBefore: boolean = false;
//   isAfter: boolean = false;

//   constructor({
//     geometry,
//     gl,
//     image,
//     index,
//     length,
//     renderer,
//     scene,
//     screen,
//     text,
//     description,
//     viewport,
//     bend,
//     textColor,
//     borderRadius = 0,
//     font,
//   }: MediaProps) {
//     this.geometry = geometry;
//     this.gl = gl;
//     this.image = image;
//     this.index = index;
//     this.length = length;
//     this.renderer = renderer;
//     this.scene = scene;
//     this.screen = screen;
//     this.text = text;
//     this.description = description;
//     this.viewport = viewport;
//     this.bend = bend;
//     this.textColor = textColor;
//     this.borderRadius = borderRadius;
//     this.font = font;
//     this.createShader();
//     this.createMesh();
//     this.createTitle();
//     this.createDescription();
//     this.onResize();
//   }

//   createShader() {
//     const texture = new Texture(this.gl, { generateMipmaps: false });
//     this.program = new Program(this.gl, {
//       depthTest: false,
//       depthWrite: false,
//       vertex: `
//         precision highp float;
//         attribute vec3 position;
//         attribute vec2 uv;
//         uniform mat4 modelViewMatrix;
//         uniform mat4 projectionMatrix;
//         uniform float uTime;
//         uniform float uSpeed;
//         varying vec2 vUv;
//         void main() {
//           vUv = uv;
//           vec3 p = position;
//           p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
//           gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
//         }
//       `,
//       fragment: `
//         precision highp float;
//         uniform vec2 uImageSizes;
//         uniform vec2 uPlaneSizes;
//         uniform sampler2D tMap;
//         uniform float uBorderRadius;
//         varying vec2 vUv;
        
//         float roundedBoxSDF(vec2 p, vec2 b, float r) {
//           vec2 d = abs(p) - b;
//           return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
//         }
        
//         void main() {
//           vec2 ratio = vec2(
//             min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
//             min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
//           );
//           vec2 uv = vec2(
//             vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
//             vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
//           );
//           vec4 color = texture2D(tMap, uv);
          
//           float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
//           if(d > 0.0) {
//             discard;
//           }
          
//           gl_FragColor = vec4(color.rgb, 1.0);
//         }
//       `,
//       uniforms: {
//         tMap: { value: texture },
//         uPlaneSizes: { value: [0, 0] },
//         uImageSizes: { value: [0, 0] },
//         uSpeed: { value: 0 },
//         uTime: { value: 100 * Math.random() },
//         uBorderRadius: { value: this.borderRadius },
//       },
//       transparent: true,
//     });
//     const img = new Image();
//     img.crossOrigin = "anonymous";
//     img.src = this.image;
//     img.onload = () => {
//       texture.image = img;
//       this.program.uniforms.uImageSizes.value = [
//         img.naturalWidth,
//         img.naturalHeight,
//       ];
//     };
//   }

//   createMesh() {
//     this.plane = new Mesh(this.gl, {
//       geometry: this.geometry,
//       program: this.program,
//     });
//     this.plane.setParent(this.scene);
//   }

//   createTitle() {
//     this.title = new Title({
//       gl: this.gl,
//       plane: this.plane,
//       renderer: this.renderer,
//       text: this.text,
//       textColor: "#0f9952", // force green for all titles
//       font: this.font,
//       offsetY: 0,
//     });
//   }

//   createDescription() {
//     if (!this.description) return;
//     this.descriptionObj = new Description({
//       gl: this.gl,
//       plane: this.plane,
//       renderer: this.renderer,
//       description: this.description,
//       textColor: "#8a8a8a",
//       font: "normal 18px sans-serif",
//       offsetY: -0.07,
//     });
//   }

//   update(
//     scroll: { current: number; last: number },
//     direction: "right" | "left"
//   ) {
//     this.plane.position.x = this.x - scroll.current - this.extra;

//     const x = this.plane.position.x;
//     const H = this.viewport.width / 2;

//     if (this.bend === 0) {
//       this.plane.position.y = 0;
//       this.plane.rotation.z = 0;
//     } else {
//       const B_abs = Math.abs(this.bend);
//       const R = (H * H + B_abs * B_abs) / (2 * B_abs);
//       const effectiveX = Math.min(Math.abs(x), H);

//       const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
//       if (this.bend > 0) {
//         this.plane.position.y = -arc;
//         this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
//       } else {
//         this.plane.position.y = arc;
//         this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
//       }
//     }

//     this.speed = scroll.current - scroll.last;
//     this.program.uniforms.uTime.value += 0.04;
//     this.program.uniforms.uSpeed.value = this.speed;

//     const planeOffset = this.plane.scale.x / 2;
//     const viewportOffset = this.viewport.width / 2;
//     this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
//     this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
//     if (direction === "right" && this.isBefore) {
//       this.extra -= this.widthTotal;
//       this.isBefore = this.isAfter = false;
//     }
//     if (direction === "left" && this.isAfter) {
//       this.extra += this.widthTotal;
//       this.isBefore = this.isAfter = false;
//     }
//   }

//   onResize({
//     screen,
//     viewport,
//   }: { screen?: ScreenSize; viewport?: Viewport } = {}) {
//     if (screen) this.screen = screen;
//     if (viewport) {
//       this.viewport = viewport;
//       if (this.plane.program.uniforms.uViewportSizes) {
//         this.plane.program.uniforms.uViewportSizes.value = [
//           this.viewport.width,
//           this.viewport.height,
//         ];
//       }
//     }
//     this.scale = this.screen.height / 1500;
//     this.plane.scale.x =
//       (this.viewport.width * (900 * this.scale)) / this.screen.width;
//     this.plane.scale.y =
//       (this.viewport.height * (700 * this.scale)) / this.screen.height;
//     this.plane.program.uniforms.uPlaneSizes.value = [
//       this.plane.scale.x,
//       this.plane.scale.y,
//     ];
//     this.padding = 2;
//     this.width = this.plane.scale.x + this.padding;
//     this.widthTotal = this.width * this.length;
//     this.x = this.width * this.index;
//   }
// }

// interface ItemData {
//   image: string;
//   text: string;
//   description?: string;
// }

// interface AppConfig {
//   items?: ItemData[];
//   bend?: number;
//   textColor?: string;
//   borderRadius?: number;
//   font?: string;
// }

// class App {
//   container: HTMLElement;
//   scroll: {
//     ease: number;
//     current: number;
//     target: number;
//     last: number;
//     position?: number;
//   };
//   onCheckDebounce: (...args: any[]) => void;
//   renderer!: Renderer;
//   gl!: GL;
//   camera!: Camera;
//   scene!: Transform;
//   planeGeometry!: Plane;
//   medias: Media[] = [];
//   mediasImages: ItemData[] = [];
//   screen!: { width: number; height: number };
//   viewport!: { width: number; height: number };
//   raf: number = 0;

//   boundOnResize!: () => void;
//   boundOnWheel!: () => void;
//   boundOnTouchDown!: (e: MouseEvent | TouchEvent) => void;
//   boundOnTouchMove!: (e: MouseEvent | TouchEvent) => void;
//   boundOnTouchUp!: () => void;

//   isDown: boolean = false;
//   start: number = 0;

//   constructor(
//     container: HTMLElement,
//     {
//       items,
//       bend = 1,
//       textColor = "#0f9952",
//       borderRadius = 0,
//       font = "bold 30px Figtree",
//     }: AppConfig
//   ) {
//     document.documentElement.classList.remove("no-js");
//     this.container = container;
//     this.scroll = { ease: 0.05, current: 0, target: 0, last: 0 };
//     this.onCheckDebounce = debounce(this.onCheck.bind(this), 200);
//     this.createRenderer();
//     this.createCamera();
//     this.createScene();
//     this.onResize();
//     this.createGeometry();
//     this.createMedias(items, bend, textColor, borderRadius, font);
//     this.update();
//     this.addEventListeners();
//   }

//   createRenderer() {
//     this.renderer = new Renderer({ alpha: true });
//     this.gl = this.renderer.gl;
//     this.gl.clearColor(0, 0, 0, 0);
//     this.container.appendChild(this.renderer.gl.canvas as HTMLCanvasElement);
//   }

//   createCamera() {
//     this.camera = new Camera(this.gl);
//     this.camera.fov = 45;
//     this.camera.position.z = 20;
//   }

//   createScene() {
//     this.scene = new Transform();
//   }

//   createGeometry() {
//     this.planeGeometry = new Plane(this.gl, {
//       heightSegments: 50,
//       widthSegments: 100,
//     });
//   }

//   createMedias(
//     items: ItemData[] | undefined,
//     bend: number = 1,
//     textColor: string,
//     borderRadius: number,
//     font: string
//   ) {
//     const defaultItems: ItemData[] = [
//       {
//         image: `https://picsum.photos/seed/1/800/600?grayscale`,
//         text: "Multi-Threat Defense",
//         description: "Blocks Locusts, wild animals, fungi, and pests - all with one smart unit.",
//       },
//       {
//         image: `https://picsum.photos/seed/2/800/600?grayscale`,
//         text: "AI Predictive System",
//         description: "Tracks pests movement, soil health & animal paths with real-time accuracy.",
//       },
//       {
//         image: `https://picsum.photos/seed/3/800/600?grayscale`,
//         text: "Green & Sustainable",
//         description: "Aims to ₹1,500-₹2,500 per unit. Built modular. Powers itself via sun and wind",
//       },
//       {
//         image: `https://picsum.photos/seed/4/800/600?grayscale`,
//         text: "24/7 Automation",
//         description: "Works day and night, rain or shine - no labor, no guesswork, no risk, less power",
//       },
//       {
//         image: `https://picsum.photos/seed/5/800/600?grayscale`,
//         text: "Farmer-Friendly Design",
//         description: "LEGO - style modular cylindrical body, Modifiable, GSM alerts, app control, and plug-play farming upgrades",
//       },
//       {
//         image: `https://picsum.photos/seed/16/800/600?grayscale`,
//         text: "Farmers' Appstore",
//         description: "AGNI app = e-commerce, upgrades, organic buyers & live farm control",
//       },
//       {
//         image: `https://picsum.photos/seed/17/800/600?grayscale`,
//         text: "Zero Chemicals",
//         description: "Repels threats using 25+ gadgets & AI - 100% safe for soil and life",
//       },
//       {
//         image: `https://picsum.photos/seed/8/800/600?grayscale`,
//         text: "ISRO Satellite Sync",
//         description: "AGNI integrates with ISRO satellite data for precise pest path real-time alerts & prediction",
//       }
//     ];
//     const galleryItems = items && items.length ? items : defaultItems;
//     // DO NOT duplicate the array, just use the 8 cards
//     this.mediasImages = galleryItems;
//     this.medias = this.mediasImages.map((data, index) => {
//       return new Media({
//         geometry: this.planeGeometry,
//         gl: this.gl,
//         image: data.image,
//         index,
//         length: this.mediasImages.length,
//         renderer: this.renderer,
//         scene: this.scene,
//         screen: this.screen,
//         text: data.text,
//         description: data.description,
//         viewport: this.viewport,
//         bend,
//         textColor,
//         borderRadius,
//         font,
//       });
//     });
//   }

//   onTouchDown(e: MouseEvent | TouchEvent) {
//     this.isDown = true;
//     this.scroll.position = this.scroll.current;
//     this.start = "touches" in e ? e.touches[0].clientX : e.clientX;
//   }

//   onTouchMove(e: MouseEvent | TouchEvent) {
//     if (!this.isDown) return;
//     const x = "touches" in e ? e.touches[0].clientX : e.clientX;
//     const distance = (this.start - x) * 0.05;
//     this.scroll.target = (this.scroll.position ?? 0) + distance;
//   }

//   onTouchUp() {
//     this.isDown = false;
//     this.onCheck();
//   }

//   onWheel() {
//     this.scroll.target += 2;
//     this.onCheckDebounce();
//   }

//   onCheck() {
//     if (!this.medias || !this.medias[0]) return;
//     const width = this.medias[0].width;
//     const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
//     const item = width * itemIndex;
//     this.scroll.target = this.scroll.target < 0 ? -item : item;
//   }

//   onResize() {
//     this.screen = {
//       width: this.container.clientWidth,
//       height: this.container.clientHeight,
//     };
//     this.renderer.setSize(this.screen.width, this.screen.height);
//     this.camera.perspective({
//       aspect: this.screen.width / this.screen.height,
//     });
//     const fov = (this.camera.fov * Math.PI) / 180;
//     const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
//     const width = height * this.camera.aspect;
//     this.viewport = { width, height };
//     if (this.medias) {
//       this.medias.forEach((media) =>
//         media.onResize({ screen: this.screen, viewport: this.viewport })
//       );
//     }
//   }

//   update() {
//     this.scroll.current = lerp(
//       this.scroll.current,
//       this.scroll.target,
//       this.scroll.ease
//     );
//     const direction = this.scroll.current > this.scroll.last ? "right" : "left";
//     if (this.medias) {
//       this.medias.forEach((media) => media.update(this.scroll, direction));
//     }
//     this.renderer.render({ scene: this.scene, camera: this.camera });
//     this.scroll.last = this.scroll.current;
//     this.raf = window.requestAnimationFrame(this.update.bind(this));
//   }

//   addEventListeners() {
//     this.boundOnResize = this.onResize.bind(this);
//     this.boundOnWheel = this.onWheel.bind(this);
//     this.boundOnTouchDown = this.onTouchDown.bind(this);
//     this.boundOnTouchMove = this.onTouchMove.bind(this);
//     this.boundOnTouchUp = this.onTouchUp.bind(this);
//     window.addEventListener("resize", this.boundOnResize);
//     window.addEventListener("mousewheel", this.boundOnWheel);
//     window.addEventListener("wheel", this.boundOnWheel);
//     window.addEventListener("mousedown", this.boundOnTouchDown);
//     window.addEventListener("mousemove", this.boundOnTouchMove);
//     window.addEventListener("mouseup", this.boundOnTouchUp);
//     window.addEventListener("touchstart", this.boundOnTouchDown);
//     window.addEventListener("touchmove", this.boundOnTouchMove);
//     window.addEventListener("touchend", this.boundOnTouchUp);
//   }

//   destroy() {
//     window.cancelAnimationFrame(this.raf);
//     window.removeEventListener("resize", this.boundOnResize);
//     window.removeEventListener("mousewheel", this.boundOnWheel);
//     window.removeEventListener("wheel", this.boundOnWheel);
//     window.removeEventListener("mousedown", this.boundOnTouchDown);
//     window.removeEventListener("mousemove", this.boundOnTouchMove);
//     window.removeEventListener("mouseup", this.boundOnTouchUp);
//     window.removeEventListener("touchstart", this.boundOnTouchDown);
//     window.removeEventListener("touchmove", this.boundOnTouchMove);
//     window.removeEventListener("touchend", this.boundOnTouchUp);
//     if (
//       this.renderer &&
//       this.renderer.gl &&
//       this.renderer.gl.canvas.parentNode
//     ) {
//       this.renderer.gl.canvas.parentNode.removeChild(
//         this.renderer.gl.canvas as HTMLCanvasElement
//       );
//     }
//   }
// }

// interface CircularGalleryProps {
//   items?: ItemData[];
//   bend?: number;
//   textColor?: string;
//   borderRadius?: number;
//   font?: string;
// }

// export default function CircularGallery({
//   items,
//   bend = 3,
//   textColor = "#0f9952",
//   borderRadius = 0.05,
//   font = "bold 30px Figtree",
// }: CircularGalleryProps) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   useEffect(() => {
//     if (!containerRef.current) return;
//     const app = new App(containerRef.current, {
//       items,
//       bend,
//       textColor,
//       borderRadius,
//       font,
//     });
//     return () => {
//       app.destroy();
//     };
//   }, [items, bend, textColor, borderRadius, font]);
//   return <div
//     className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing bg-white"
//     ref={containerRef}
//   />;
// }


// 'use client';


// import React, { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
// import { ChevronLeft, ChevronRight, Trophy, Crown, Cpu, ShieldCheck, Smartphone, ShoppingCart, Briefcase, Globe } from 'lucide-react';
// import { cn } from './utils';

// interface CardData {
//   id: number;
//   title: string;
//   description: string;
//   icon: React.ComponentType<any>;
//   bgColor: string;
//   textColor: string;
// }

// const cardsData: CardData[] = [
//   {
//     id: 1,
//     title: "First of Its Kind",
//     description: "No drones. No gimmicks. AGNI is the first self-defending farm unit in history.",
//     icon: Trophy,
//     bgColor: "#0f9952",
//     textColor: "white"
//   },
//   {
//     id: 2,
//     title: "Monopoly Machine",
//     description: "Zero competitors. Patentable tech stack. Mini subscription empire.",
//     icon: Crown,
//     bgColor: "#2e7377",
//     textColor: "white"
//   },
//   {
//     id: 3,
//     title: "Predictive AI System",
//     description: "Works day and night, rain or shine — no labor, no guesswork, less power.",
//     icon: Cpu,
//     bgColor: "#0f9952",
//     textColor: "white"
//   },
//   {
//     id: 4,
//     title: "Multi-Threat Killer",
//     description: "Neutralizes locusts, pests, wild animals, fungi & disease — no chemicals.",
//     icon: ShieldCheck,
//     bgColor: "#2e7377",
//     textColor: "white"
//   },
//   {
//     id: 5,
//     title: "Farmer SuperApp Ecosystem",
//     description: "E-commerce. Upgrades. Buyers. Alerts. Subsidies — all in one tap.",
//     icon: Smartphone,
//     bgColor: "#0f9952",
//     textColor: "white"
//   },
//   {
//     id: 6,
//     title: "Agri E-Commerce Hub",
//     description: "Farmers get tools, sensors, and sell produce — like Amazon for farming.",
//     icon: ShoppingCart,
//     bgColor: "#2e7377",
//     textColor: "white"
//   },
//   {
//     id: 7,
//     title: "Rural Business Builder",
//     description: "Empowers farmers as entrepreneurs — sell, earn, access micro-loans.",
//     icon: Briefcase,
//     bgColor: "#0f9952",
//     textColor: "white"
//   },
//   {
//     id: 8,
//     title: "Built for Bharat. Built for World",
//     description: "Modular, rugged, subsidy-ready. Expandable to Asia, Africa & beyond.",
//     icon: Globe,
//     bgColor: "#2e7377",
//     textColor: "white"
//   }
// ];

// export default function ThreeDCarousel() {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isHovered, setIsHovered] = useState(false);
//   const [direction, setDirection] = useState(0);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [isMobile, setIsMobile] = useState(false);

//   // Mouse position for 3D tilt effect
//   const mouseX = useMotionValue(0);
//   const mouseY = useMotionValue(0);
//   const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
//   const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   useEffect(() => {
//     const handleKeyPress = (e: KeyboardEvent) => {
//       if (e.key === 'ArrowLeft') {
//         handlePrevious();
//       } else if (e.key === 'ArrowRight') {
//         handleNext();
//       }
//     };

//     window.addEventListener('keydown', handleKeyPress);
//     return () => window.removeEventListener('keydown', handleKeyPress);
//   }, [currentIndex]);

//   const handleNext = () => {
//     setDirection(1);
//     setCurrentIndex((prev) => (prev + 1) % cardsData.length);
//   };

//   const handlePrevious = () => {
//     setDirection(-1);
//     setCurrentIndex((prev) => (prev - 1 + cardsData.length) % cardsData.length);
//   };

//   const handleMouseMove = (e: React.MouseEvent) => {
//     if (!isHovered) return;
    
//     const rect = e.currentTarget.getBoundingClientRect();
//     const centerX = rect.left + rect.width / 2;
//     const centerY = rect.top + rect.height / 2;
    
//     mouseX.set(e.clientX - centerX);
//     mouseY.set(e.clientY - centerY);
//   };

//   const handleMouseLeave = () => {
//     setIsHovered(false);
//     mouseX.set(0);
//     mouseY.set(0);
//   };

//   // Touch handling
//   const [touchStart, setTouchStart] = useState<number | null>(null);
//   const [touchEnd, setTouchEnd] = useState<number | null>(null);

//   const minSwipeDistance = 50;

//   const onTouchStart = (e: React.TouchEvent) => {
//     setTouchEnd(null);
//     setTouchStart(e.targetTouches[0].clientX);
//   };

//   const onTouchMove = (e: React.TouchEvent) => {
//     setTouchEnd(e.targetTouches[0].clientX);
//   };

//   const onTouchEnd = () => {
//     if (!touchStart || !touchEnd) return;
    
//     const distance = touchStart - touchEnd;
//     const isLeftSwipe = distance > minSwipeDistance;
//     const isRightSwipe = distance < -minSwipeDistance;

//     if (isLeftSwipe) {
//       handleNext();
//     } else if (isRightSwipe) {
//       handlePrevious();
//     }
//   };

//   // Wheel handling for desktop
//   const handleWheel = (e: React.WheelEvent) => {
//     e.preventDefault();
//     const delta = e.deltaY;
    
//     if (Math.abs(delta) > 5) {
//       if (delta > 0) {
//         handleNext();
//       } else {
//         handlePrevious();
//       }
//     }
//   };

//   const variants = {
//     enter: (direction: number) => ({
//       rotateY: direction > 0 ? 90 : -90,
//       opacity: 0,
//       scale: 0.8,
//       z: -200,
//     }),
//     center: {
//       rotateY: 0,
//       opacity: 1,
//       scale: 1,
//       z: 0,
//       transition: {
//         duration: 0.8,
//         ease: [0.25, 0.46, 0.45, 0.94],
//       },
//     },
//     exit: (direction: number) => ({
//       rotateY: direction < 0 ? 90 : -90,
//       opacity: 0,
//       scale: 0.8,
//       z: -200,
//       transition: {
//         duration: 0.8,
//         ease: [0.25, 0.46, 0.45, 0.94],
//       },
//     }),
//   };

//   const currentCard = cardsData[currentIndex];
//   const IconComponent = currentCard.icon;

//   return (
//     <div className="relative w-full h-screen overflow-hidden">
//       {/* Backdrop glow */}
//       <div 
//         className="absolute inset-0 opacity-20 blur-3xl"
//         style={{
//           background: `radial-gradient(circle at center, ${currentCard.bgColor === 'white' ? '#2e7377' : '#ffffff'}40, transparent 70%)`
//         }}
//       />

//       {/* Main carousel container */}
//       <div
//         ref={containerRef}
//         className="flex items-center justify-center h-full px-4 md:px-8"
//         onMouseMove={handleMouseMove}
//         onMouseLeave={handleMouseLeave}
//         onTouchStart={onTouchStart}
//         onTouchMove={onTouchMove}
//         onTouchEnd={onTouchEnd}
//         onWheel={handleWheel}
//         style={{ perspective: '1000px' }}
//       >
//         {/* Navigation arrows - Desktop only */}
//         {!isMobile && (
//           <>
//             <button
//               onClick={handlePrevious}
//               className="absolute left-8 top-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center font-extrabold text-[#0f9952] hover:bg-white/20 transition-all duration-300 hover:scale-110 shadow-lg"
//             >
//               <ChevronLeft size={40} />
//             </button>
//             <button
//               onClick={handleNext}
//               className="absolute right-8 top-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center font-extrabold text-[#0f9952] hover:bg-white/20 transition-all duration-300 hover:scale-110 shadow-lg"
//             >
//               <ChevronRight size={40} />
//             </button>
//           </>
//         )}

//         {/* Card container */}
//         <div className="relative w-full max-w-4xl aspect-video" style={{ transformStyle: 'preserve-3d' }}>
//           <AnimatePresence mode="wait" custom={direction}>
//             <motion.div
//               key={currentIndex}
//               custom={direction}
//               variants={variants}
//               initial="enter"
//               animate="center"
//               exit="exit"
//               className="absolute inset-0"
//               style={{
//                 transformStyle: 'preserve-3d',
//                 rotateX: isHovered ? rotateX : 0,
//                 rotateY: isHovered ? rotateY : 0,
//               }}
//               onMouseEnter={() => setIsHovered(true)}
//               whileHover={{
//                 scale: 1.02,
//                 transition: { duration: 0.3 }
//               }}
//             >
//               <div
//                 className={cn(
//                   "relative w-full h-full rounded-3xl overflow-hidden",
//                   "shadow-[0_30px_60px_rgba(0,0,0,0.12)]",
//                   "backdrop-blur-sm border border-white/10"
//                 )}
//                 style={{
//                   backgroundColor: currentCard.bgColor,
//                   color: currentCard.textColor,
//                 }}
//               >
//                 {/* Glare effect on hover */}
//                 {isHovered && (
//                   <motion.div
//                     className="absolute inset-0 opacity-20 pointer-events-none"
//                     style={{
//                       background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.3), transparent 70%)',
//                     }}
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 0.2 }}
//                     transition={{ duration: 0.3 }}
//                   />
//                 )}

//                 {/* Glass morphism overlay */}
//                 <div
//                   className="absolute inset-0 opacity-5"
//                   style={{
//                     background: `linear-gradient(135deg, ${currentCard.textColor}20, transparent 50%, ${currentCard.textColor}10)`
//                   }}
//                 />

//                 {/* Card content */}
//                 <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 md:p-12 text-center">
//                   <motion.div
//                     className="mb-6 md:mb-8"
//                     initial={{ scale: 0, opacity: 0 }}
//                     animate={{ scale: 1, opacity: 1 }}
//                     transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
//                   >
//                     <IconComponent 
//                       size={48} 
//                       className={cn(
//                         "transition-colors duration-300",
//                         currentCard.bgColor === 'white' ? 'text-[#2e7377]' : 'text-white'
//                       )}
//                     />
//                   </motion.div>
                  
//                   <motion.h2
//                     className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 tracking-tight"
//                     initial={{ y: 30, opacity: 0 }}
//                     animate={{ y: 0, opacity: 1 }}
//                     transition={{ delay: 0.5, duration: 0.6 }}
//                   >
//                     {currentCard.title}
//                   </motion.h2>
                  
//                   <motion.p
//                     className="text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl opacity-80"
//                     initial={{ y: 30, opacity: 0 }}
//                     animate={{ y: 0, opacity: 1 }}
//                     transition={{ delay: 0.7, duration: 0.6 }}
//                   >
//                     {currentCard.description}
//                   </motion.p>
//                 </div>
//               </div>
//             </motion.div>
//           </AnimatePresence>
//         </div>
//       </div>

//       {/* Navigation dots */}
//       <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-4 z-20">
//         <div className="flex space-x-2">
//           {cardsData.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => {
//                 setDirection(index > currentIndex ? 1 : -1);
//                 setCurrentIndex(index);
//               }}
//               className={cn(
//                 "transition-all duration-300 rounded-full",
//                 index === currentIndex
//                   ? "w-8 h-2 bg-[#0f9952]"
//                   : "w-2 h-2 bg-black/30 hover:bg-black/50"
//               )}
//             />
//           ))}
//         </div>
        
//         <p className="text-gray-400 text-xs">
//           Swipe to explore more
//         </p>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, Trophy, Crown, Cpu, ShieldCheck, Smartphone, ShoppingCart, Briefcase, Globe } from 'lucide-react';
import { cn } from './utils';

interface CardData {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  bgColor: string;
  textColor: string;
}

const cardsData: CardData[] = [
  {
    id: 1,
    title: "First of Its Kind",
    description: "No drones. No gimmicks. AGNI is the first self-defending farm unit in history.",
    icon: Trophy,
    bgColor: "#0f9952",
    textColor: "white"
  },
  {
    id: 2,
    title: "Monopoly Machine",
    description: "Zero competitors. Patentable tech stack. Mini subscription empire.",
    icon: Crown,
    bgColor: "#2e7377",
    textColor: "white"
  },
  {
    id: 3,
    title: "Predictive AI System",
    description: "Works day and night, rain or shine — no labor, no guesswork, less power.",
    icon: Cpu,
    bgColor: "#0f9952",
    textColor: "white"
  },
  {
    id: 4,
    title: "Multi-Threat Killer",
    description: "Neutralizes locusts, pests, wild animals, fungi & disease — no chemicals.",
    icon: ShieldCheck,
    bgColor: "#2e7377",
    textColor: "white"
  },
  {
    id: 5,
    title: "Farmer SuperApp Ecosystem",
    description: "E-commerce. Upgrades. Buyers. Alerts. Subsidies — all in one tap.",
    icon: Smartphone,
    bgColor: "#0f9952",
    textColor: "white"
  },
  {
    id: 6,
    title: "Agri E-Commerce Hub",
    description: "Farmers get tools, sensors, and sell produce — like Amazon for farming.",
    icon: ShoppingCart,
    bgColor: "#2e7377",
    textColor: "white"
  },
  {
    id: 7,
    title: "Rural Business Builder",
    description: "Empowers farmers as entrepreneurs — sell, earn, access micro-loans.",
    icon: Briefcase,
    bgColor: "#0f9952",
    textColor: "white"
  },
  {
    id: 8,
    title: "Built for Bharat. Built for World",
    description: "Modular, rugged, subsidy-ready. Expandable to Asia, Africa & beyond.",
    icon: Globe,
    bgColor: "#2e7377",
    textColor: "white"
  }
];

export default function ThreeDCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Mouse position for 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % cardsData.length);
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + cardsData.length) % cardsData.length);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isHovered) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // Touch handling
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }
  };

  // Wheel handling for desktop
  const handleWheel = (e: React.WheelEvent) => {
    // e.preventDefault();
    const delta = e.deltaY;
    if (Math.abs(delta) > 5) {
      if (delta > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    }
  };

  const variants = {
    enter: (direction: number) => ({
      rotateY: direction > 0 ? 90 : -90,
      opacity: 0,
      scale: 0.8,
      z: -200,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      z: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    exit: (direction: number) => ({
      rotateY: direction < 0 ? 90 : -90,
      opacity: 0,
      scale: 0.8,
      z: -200,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  };

  const currentCard = cardsData[currentIndex];
  const IconComponent = currentCard.icon;

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        isMobile ? "h-[420px] min-h-[0]" : "h-screen"
      )}
    >
      {/* Backdrop glow */}
      <div 
        className="absolute inset-0 opacity-20 blur-3xl"
        style={{
          background: `radial-gradient(circle at center, ${currentCard.bgColor === 'white' ? '#2e7377' : '#ffffff'}40, transparent 70%)`
        }}
      />

      {/* Main carousel container */}
      <div
        ref={containerRef}
        className={cn(
          "flex items-center justify-center w-full h-full px-4 md:px-8",
          isMobile && "py-0"
        )}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onWheel={handleWheel}
        style={{ perspective: '1000px' }}
      >
        {/* Navigation arrows - Desktop only */}
        {!isMobile && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-8 top-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center font-extrabold text-[#0f9952] hover:bg-white/20 transition-all duration-300 hover:scale-110 shadow-lg"
            >
              <ChevronLeft size={40} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-8 top-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center font-extrabold text-[#0f9952] hover:bg-white/20 transition-all duration-300 hover:scale-110 shadow-lg"
            >
              <ChevronRight size={40} />
            </button>
          </>
        )}

        {/* Card container */}
        <div
          className={cn(
            "relative w-full max-w-4xl aspect-video",
            isMobile && "max-w-md" // limit card width on mobile, but keep aspect ratio
          )}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
              style={{
                transformStyle: 'preserve-3d',
                rotateX: isHovered ? rotateX : 0,
                rotateY: isHovered ? rotateY : 0,
              }}
              onMouseEnter={() => setIsHovered(true)}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
            >
              <div
                className={cn(
                  "relative w-full h-full rounded-3xl overflow-hidden",
                  "shadow-[0_30px_60px_rgba(0,0,0,0.12)]",
                  "backdrop-blur-sm border border-white/10"
                )}
                style={{
                  backgroundColor: currentCard.bgColor,
                  color: currentCard.textColor,
                }}
              >
                {/* Glare effect on hover */}
                {isHovered && (
                  <motion.div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.3), transparent 70%)',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.2 }}
                    transition={{ duration: 0.3 }}
                  />
                )}

                {/* Glass morphism overlay */}
                <div
                  className="absolute inset-0 opacity-5"
                  style={{
                    background: `linear-gradient(135deg, ${currentCard.textColor}20, transparent 50%, ${currentCard.textColor}10)`
                  }}
                />

                {/* Card content */}
                <div className={cn(
                  "relative z-10 flex flex-col items-center justify-center h-full p-8 md:p-12 text-center",
                  isMobile && "p-4"
                )}>
                  <motion.div
                    className="mb-6 md:mb-8"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
                  >
                    <IconComponent 
                      size={48} 
                      className={cn(
                        "transition-colors duration-300",
                        currentCard.bgColor === 'white' ? 'text-[#2e7377]' : 'text-white'
                      )}
                    />
                  </motion.div>
                  
                  <motion.h2
                    className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 tracking-tight"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    {currentCard.title}
                  </motion.h2>
                  
                  <motion.p
                    className="text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl opacity-80"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  >
                    {currentCard.description}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-4">
        <div className="flex space-x-2">
          {cardsData.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={cn(
                "transition-all duration-300 rounded-full",
                index === currentIndex
                  ? "w-8 h-2 bg-[#0f9952]"
                  : "w-2 h-2 bg-black/30 hover:bg-black/50"
              )}
            />
          ))}
        </div>
        
        <p className="text-gray-400 text-xs">
          Swipe to explore more
        </p>
      </div>
    </div>
  );
}

