// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import {
//   Palette,
//   Sun,
//   Moon,
//   Monitor,
//   Check,
//   Save
// } from 'lucide-react';
// import { useThemeStore } from '../../contexts/ThemeStore';
// import BackButton from '../../components/buttons/BackButton';

// const ThemeAppearance: React.FC = () => {
//   const { isDark, toggleTheme } = useThemeStore();
//   const [saved, setSaved] = useState(false);
//   const [settings, setSettings] = useState({
//     compactMode: false,
//     animations: true,
//     fontSize: 'medium',
//     accentColor: 'primary'
//   });

//   const handleSave = () => {
//     setSaved(true);
//     setTimeout(() => setSaved(false), 2000);
//   };

//   const themeOptions = [
//     {
//       id: 'light',
//       name: 'Light',
//       description: 'Clean and bright interface',
//       icon: Sun,
//       active: !isDark
//     },
//     {
//       id: 'dark',
//       name: 'Dark',
//       description: 'Easy on the eyes in low light',
//       icon: Moon,
//       active: isDark
//     }
//   ];

//   const accentColors = [
//     { name: 'Blue', value: 'primary', color: 'bg-[var(--color-primary)]' },
//     { name: 'Purple', value: 'accent', color: 'bg-[var(--color-accent)]' },
//     { name: 'Success', value: 'success', color: 'bg-[var(--color-success)]' },
//     { name: 'Warning', value: 'warning', color: 'bg-[var(--color-warning)]' },
//     { name: 'Danger', value: 'danger', color: 'bg-[var(--color-danger)]' },
//     { name: 'Gray', value: 'gray', color: 'bg-[var(--color-gray-400)]' }
//   ];

//   const fontSizes = [
//     { name: 'Small', value: 'small' },
//     { name: 'Medium', value: 'medium' },
//     { name: 'Large', value: 'large' }
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <BackButton to="/settings" label="Back to Settings" variant="default" />
//           <div>
//             <h1 className="text-2xl font-bold flex items-center space-x-3"
//               style={{ color: 'var(--color-primary-dark)' }}>
//               <Palette className="w-8 h-8 text-[var(--color-accent)]" />
//               <span>Theme & Appearance</span>
//             </h1>
//             <p style={{ color: 'var(--color-gray-500)' }}>
//               Customize the look and feel of your application
//             </p>
//           </div>
//         </div>
//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           onClick={handleSave}
//           className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
//             saved
//               ? 'bg-[var(--color-success)] text-white'
//               : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white'
//           }`}
//         >
//           {saved ? (
//             <>
//               <Check className="w-4 h-4" />
//               <span>Saved</span>
//             </>
//           ) : (
//             <>
//               <Save className="w-4 h-4" />
//               <span>Save Changes</span>
//             </>
//           )}
//         </motion.button>
//       </div>

//       {/* Theme Selection */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="rounded-xl p-6 shadow-sm border"
//         style={{
//           background: 'var(--color-surface)',
//           borderColor: 'var(--color-gray-200)',
//           color: 'var(--color-gray-900)'
//         }}
//       >
//         <div className="flex items-center space-x-3 mb-6">
//           <div className="p-2 rounded-lg" style={{ background: 'var(--color-accent-light)' }}>
//             <Palette className="w-5 h-5 text-[var(--color-accent)]" />
//           </div>
//           <div>
//             <h3 className="text-lg font-semibold" style={{ color: 'var(--color-primary-dark)' }}>Theme Mode</h3>
//             <p className="text-sm" style={{ color: 'var(--color-gray-500)' }}>Choose your preferred theme</p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {themeOptions.map((option) => {
//             const IconComponent = option.icon;
//             return (
//               <motion.button
//                 key={option.id}
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={() => toggleTheme()}
//                 className={`p-4 rounded-lg border-2 transition-all ${
//                   option.active
//                     ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]'
//                     : 'border-[var(--color-gray-200)] hover:border-[var(--color-primary-dark)]'
//                 }`}
//               >
//                 <div className="flex flex-col items-center space-y-3">
//                   <div className="p-3 rounded-lg"
//                     style={{
//                       background: option.active
//                         ? 'var(--color-primary-light)'
//                         : 'var(--color-gray-100)'
//                     }}>
//                     <IconComponent className="w-6 h-6"
//                       style={{
//                         color: option.active
//                           ? 'var(--color-primary-dark)'
//                           : 'var(--color-gray-500)'
//                       }} />
//                   </div>
//                   <div className="text-center">
//                     <h4 className="font-medium" style={{ color: 'var(--color-primary-dark)' }}>{option.name}</h4>
//                     <p className="text-xs mt-1" style={{ color: 'var(--color-gray-500)' }}>{option.description}</p>
//                   </div>
//                   {option.active && (
//                     <div className="w-5 h-5 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
//                       <Check className="w-3 h-3 text-white" />
//                     </div>
//                   )}
//                 </div>
//               </motion.button>
//             );
//           })}
//         </div>
//       </motion.div>

//       {/* Accent Color */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, delay: 0.1 }}
//         className="rounded-xl p-6 shadow-sm border"
//         style={{
//           background: 'var(--color-surface)',
//           borderColor: 'var(--color-gray-200)',
//           color: 'var(--color-gray-900)'
//         }}
//       >
//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-primary-dark)' }}>Accent Color</h3>
//           <p className="text-sm" style={{ color: 'var(--color-gray-500)' }}>Choose your preferred accent color</p>
//         </div>

//         <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
//           {accentColors.map((color) => (
//             <motion.button
//               key={color.value}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setSettings(prev => ({ ...prev, accentColor: color.value }))}
//               className={`p-3 rounded-lg border-2 transition-all ${
//                 settings.accentColor === color.value
//                   ? 'border-[var(--color-accent)]'
//                   : 'border-[var(--color-gray-200)]'
//               }`}
//             >
//               <div className="flex flex-col items-center space-y-2">
//                 <div className={`w-8 h-8 rounded-full ${color.color}`} />
//                 <span className="text-xs font-medium" style={{ color: 'var(--color-primary-dark)' }}>{color.name}</span>
//                 {settings.accentColor === color.value && (
//                   <Check className="w-4 h-4 text-[var(--color-success)]" />
//                 )}
//               </div>
//             </motion.button>
//           ))}
//         </div>
//       </motion.div>

//       {/* Display Options */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, delay: 0.2 }}
//         className="rounded-xl p-6 shadow-sm border"
//         style={{
//           background: 'var(--color-surface)',
//           borderColor: 'var(--color-gray-200)',
//           color: 'var(--color-gray-900)'
//         }}
//       >
//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-primary-dark)' }}>Display Options</h3>
//           <p className="text-sm" style={{ color: 'var(--color-gray-500)' }}>Customize your display preferences</p>
//         </div>

//         <div className="space-y-6">
//           {/* Font Size */}
//           <div>
//             <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-primary-dark)' }}>
//               Font Size
//             </label>
//             <div className="flex space-x-3">
//               {fontSizes.map((size) => (
//                 <button
//                   key={size.value}
//                   onClick={() => setSettings(prev => ({ ...prev, fontSize: size.value }))}
//                   className={`px-4 py-2 rounded-lg border transition-colors ${
//                     settings.fontSize === size.value
//                       ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]'
//                       : 'border-[var(--color-gray-200)] text-[var(--color-gray-500)] hover:border-[var(--color-primary-dark)]'
//                   }`}
//                 >
//                   {size.name}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Toggle Options */}
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium" style={{ color: 'var(--color-primary-dark)' }}>Compact Mode</p>
//                 <p className="text-xs" style={{ color: 'var(--color-gray-500)' }}>Reduce spacing and padding</p>
//               </div>
//               <button
//                 onClick={() => setSettings(prev => ({ ...prev, compactMode: !prev.compactMode }))}
//                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
//                   settings.compactMode ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-gray-200)]'
//                 }`}
//               >
//                 <span
//                   className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                     settings.compactMode ? 'translate-x-6' : 'translate-x-1'
//                   }`}
//                 />
//               </button>
//             </div>

//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium" style={{ color: 'var(--color-primary-dark)' }}>Animations</p>
//                 <p className="text-xs" style={{ color: 'var(--color-gray-500)' }}>Enable smooth transitions and animations</p>
//               </div>
//               <button
//                 onClick={() => setSettings(prev => ({ ...prev, animations: !prev.animations }))}
//                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
//                   settings.animations ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-gray-200)]'
//                 }`}
//               >
//                 <span
//                   className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                     settings.animations ? 'translate-x-6' : 'translate-x-1'
//                   }`}
//                 />
//               </button>
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default ThemeAppearance;