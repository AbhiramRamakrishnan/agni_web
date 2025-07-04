// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */


// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import Link from 'next/link';
// import { Menu, X } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// const dropdownVariants = {
//   initial: { opacity: 0, scaleY: 0 },
//   animate: {
//     opacity: 1,
//     scaleY: 1,
//     transition: {
//       duration: 0.25,
//       ease: [0.4, 0, 0.2, 1],
//       when: 'beforeChildren',
//       staggerChildren: 0.08,
//     },
//   },
//   exit: {
//     opacity: 0,
//     scaleY: 0,
//     transition: {
//       duration: 0.2,
//       ease: [0.4, 0, 1, 1],
//       when: 'afterChildren',
//     },
//   },
// };

// const itemVariants = {
//   initial: { opacity: 0, y: -8 },
//   animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
//   exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
// };

// const links = [
//   { href: '/', label: 'Home' },
//   { href: '/about', label: 'About Us' },
//   { href: '/product', label: 'Our Products' },
//   { href: '/learn-more', label: 'Learn More' },
//   { href: '/alert', label: 'AGNI Alert' },
//   { href: '/mart', label: 'AGNI Mart' },
//   { href: '/careers', label: 'Careers' },
//   { href: '/register', label: 'Get AGNI' },
// ];

// const Navbar = () => {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // Scroll detection
//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 10);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   // Click outside or Escape to close
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsMenuOpen(false);
//       }
//     };

//     const handleEscape = (event: KeyboardEvent) => {
//       if (event.key === 'Escape') {
//         setIsMenuOpen(false);
//       }
//     };

//     if (isMenuOpen) {
//       document.addEventListener('mousedown', handleClickOutside);
//       document.addEventListener('keydown', handleEscape);
//       document.body.style.overflow = 'hidden'; // prevent background scroll
//     } else {
//       document.body.style.overflow = ''; // restore scroll
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//       document.removeEventListener('keydown', handleEscape);
//     };
//   }, [isMenuOpen]);

//   const toggleMenu = () => setIsMenuOpen((prev) => !prev);

//   // const logoSrc = '/Primary Text Only Logo (Capital).svg';
//   const logoSrc = '/Primary Logo (Improved).svg';


//   return (
//     <motion.nav
//       className={`fixed top-0 left-0 right-0 z-50 w-full transition-all  ${
//         isScrolled ? 'bg-white shadow-sm' : 'none'
//       }`}
//       initial={{ opacity: 1, y: 0 }}
//       animate={{ opacity: 1, y: 0 }}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-10">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <Link href="/" className="flex items-center pl-5 scale-200 md:pl-0 md:scale-220">
//             <img
//               src={logoSrc}
//               alt="Logo"
//               className={`h-8 w-auto transition duration-300 ${!isScrolled ? '' : ''}`}
//             />
//           </Link>
//           <div className='flex gap-12 items-center w-auto'>
            
//             {/* Desktop Nav */}
//             <div className="hidden md:flex space-x-6">
//               {links.map(({ href, label }) => (
//                 <Link
//                   key={label}
//                   href={href}
//                   className={`text-sm font-medium transition text-gray-800`}
//                 >
//                   {label}
//                 </Link>
//               ))}
//             </div>

//             {/* Mobile Toggle Button */}
//             <div className="md:hidden">
//               <button
//                 onClick={toggleMenu}
//                 className={`focus:outline-none transition ${
//                   isScrolled ? 'text-gray-800' : 'text-white'
//                 }`}
//                 aria-label="Toggle menu"
//               >
//                 {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//               </button>
//             </div>
//         </div>
//           </div>
          

          
//       </div>

//       {/* Mobile Dropdown Menu */}
//       <AnimatePresence>
//         {isMenuOpen && (
//           <motion.div
//             ref={dropdownRef}
//             className={`origin-top md:hidden px-4 pt-2 pb-4 space-y-2 ${
//               isScrolled ? 'bg-white' : 'bg-black'
//             }`}
//             variants={dropdownVariants}
//             initial="initial"
//             animate="animate"
//             exit="exit"
//           >
//             {links.map(({ href, label }) => (
//               <motion.div key={label} variants={itemVariants}>
//                 <Link
//                   href={href}
//                   className={`block text-sm font-medium transition ${
//                     isScrolled
//                       ? 'text-gray-800 hover:text-black'
//                       : 'text-white hover:text-gray-200'
//                   }`}
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   {label}
//                 </Link>
//               </motion.div>
//             ))}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.nav>
//   );
// };

// export default Navbar;



/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence, Easing } from 'framer-motion';

const dropdownVariants = {
  initial: { opacity: 0, scaleY: 0 },
  animate: {
    opacity: 1,
    scaleY: 1,
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 0.2, 1] as Easing,
      when: 'beforeChildren',
      staggerChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    scaleY: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1] as Easing,
      when: 'afterChildren',
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/product', label: 'Our Products' },
  { href: '/learn-more', label: 'Learn More' },
  { href: '/alert', label: 'AGNI Alert' },
  { href: '/mart', label: 'AGNI Mart' },
  { href: '/careers', label: 'Careers' },
  { href: '/register', label: 'Get AGNI' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const logoSrc = '/Primary Logo (Improved).svg';

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all ${
        isScrolled ? 'bg-white shadow-sm' : 'none'
      }`}
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-10">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center pl-5 scale-200 md:pl-0 md:scale-220">
            <img
              src={logoSrc}
              alt="Logo"
              className="h-8 w-auto transition duration-300"
            />
          </Link>
          <div className="flex gap-12 items-center w-auto">
            <div className="hidden md:flex space-x-6">
              {links.map(({ href, label }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-sm font-medium transition text-gray-800"
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className={`focus:outline-none transition ${
                  isScrolled ? 'text-gray-800' : 'text-white'
                }`}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={dropdownRef}
            className={`origin-top md:hidden px-4 pt-2 pb-4 space-y-2 ${
              isScrolled ? 'bg-white' : 'bg-black'
            }`}
            variants={dropdownVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {links.map(({ href, label }) => (
              <motion.div key={label} variants={itemVariants}>
                <Link
                  href={href}
                  className={`block text-sm font-medium transition ${
                    isScrolled
                      ? 'text-gray-800 hover:text-black'
                      : 'text-white hover:text-gray-200'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;

