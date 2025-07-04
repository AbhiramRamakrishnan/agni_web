
'use client';

import { Mail, Phone, Send, Handshake } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useRef } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { FaRegBuilding } from 'react-icons/fa';


const PROFILE_PHOTO = '\Akash_pic2.svg';
const PRIMARY = '#0f9952';

// Contact Card Component
function ContactCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
      className="relative w-full max-w-[480px]"
    >
      <Tilt
        tiltMaxAngleX={10}
        tiltMaxAngleY={10}
        glareEnable={true}
        glareMaxOpacity={0.1}
        scale={1.03}
        transitionSpeed={1200}
        className="w-full"
      >
        <div
          className="flex h-full bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden"
          style={{
            boxShadow: `0 10px 32px 0 ${PRIMARY}22, 0 1.5px 5px 0 #0001`,
            minHeight: 220,
          }}
        >
          <div className="flex items-center justify-center">
            <img
              src={PROFILE_PHOTO}
              alt="Akash Krishna U"
              className="pl-2 pr-2 max-h-full object-contain"
            />
          </div>

          <div className="flex-1 flex flex-col justify-center px-5 py-5 gap-1">
            <h3 className="text-2xl font-bold text-gray-800">Akash Krishna U</h3>
            <p className="text-[15px] font-semibold" style={{ color: PRIMARY }}>
              Founder & CEO
            </p>
            <p className="text-gray-500 text-sm mb-3">Agni Robotics</p>
            <div className="bg-[#f8fff6] border border-[#e5f8ed] rounded-xl p-3 text-sm text-gray-700 space-y-2">
              <a href="mailto:agniroboticsindia@gmail.com" className="flex items-center gap-2 hover:text-[#0f9952] transition">
                <Mail className="w-4 h-4" /> agniroboticsindia@gmail.com
              </a>
              <a href="https://www.linkedin.com/in/akashkrishna95" target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-[#0f9952] transition">
                <FaLinkedin className="w-4 h-4" /> linkedin.com/akashkrishna95
              </a>
              <a href="https://github.com/akashkrishna95" target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-[#0f9952] transition">
                <FaGithub className="w-4 h-4" /> github.com/akashkrishna95
              </a>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> 8075390837
              </div>
            </div>
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
}

// About Company Card
function AboutCompanyCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.1 }}
      className="relative w-full max-w-[480px]"
    >
      <div
        className="bg-gradient-to-br from-slate-50 via-white to-slate-100 border border-gray-100 rounded-2xl shadow-xl p-6 md:p-8"
        style={{ boxShadow: `0 7px 26px 0 ${PRIMARY}18, 0 1px 3px 0 #0001` }}
      >
        <motion.h3
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-xl sm:text-2xl font-semibold mb-3"
          style={{ color: PRIMARY }}
        >
          <FaRegBuilding />About Our Company
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-gray-700 leading-relaxed text-sm sm:text-base"
        >
          AGNI Robotics is a premium agro-tech platform revolutionizing farming through robotics, AI-powered defense, precision monitoring, and clean energy. Our ecosystem includes e-commerce, smart farm tools, and entrepreneur support. AGNI empowers agriculture with technology, sustainability, and scalability.
           <strong className="text-black font-medium"> <br />Seed the Change. Rule the Game.</strong>
        </motion.p>
      </div>
    </motion.div>
  );
}

// Main Page Component
export default function GetInTouch() {
  const bgRef = useRef(null);
  return (
    <>
      {/* 📨 Contact Section */}
      <section className="relative z-0 w-full px-4 sm:px-6 py-20 bg-white min-h-[100vh] overflow-hidden">

        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl font-extrabold text-center text-[#0f9952] mb-2"
            style={{ textShadow: `0 1.5px 16px ${PRIMARY}33, 0 1.5px 0 #fff ` }}
          >
            Get In Touch
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-center text-gray-700 mt-2 mb-12 max-w-2xl mx-auto text-lg"
          >
            Ready to start your next project? Let’s connect and bring your ideas to life.
          </motion.p>

          {/* Grid Layout */}
          <div className="flex flex-col lg:flex-row items-start gap-8 justify-center">
            <div className="flex flex-col gap-8 w-full max-w-[480px]">
              <ContactCard />
              <AboutCompanyCard />
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.98 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="w-full max-w-[480px] bg-white border border-gray-100 rounded-2xl shadow-xl p-8"
              style={{ boxShadow: `0 8px 32px 0 ${PRIMARY}1a, 0 1px 4px 0 #0001` }}
            >
              <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-[#0f9952]">
                <Handshake /> Let’s Connect
              </h3>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <input type="text" name="name" placeholder="Full Name" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f9952] text-gray-800 font-medium" />
                <input type="email" name="email" placeholder="Email Address" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f9952] text-gray-800 font-medium" />
                <div className="relative w-full">
                <select
                    name="state"
                    required
                    className="appearance-none w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0f9952] transition duration-200"
                >
                    <option value="">Select your state</option>
                    <option>Andhra Pradesh</option>
                    <option>Arunachal Pradesh</option>
                    <option>Assam</option>
                    <option>Bihar</option>
                    <option>Chhattisgarh</option>
                    <option>Goa</option>
                    <option>Gujarat</option>
                    <option>Haryana</option>
                    <option>Himachal Pradesh</option>
                    <option>Jharkhand</option>
                    <option>Karnataka</option>
                    <option>Kerala</option>
                    <option>Madhya Pradesh</option>
                    <option>Maharashtra</option>
                    <option>Manipur</option>
                    <option>Meghalaya</option>
                    <option>Mizoram</option>
                    <option>Nagaland</option>
                    <option>Odisha</option>
                    <option>Punjab</option>
                    <option>Rajasthan</option>
                    <option>Sikkim</option>
                    <option>Tamil Nadu</option>
                    <option>Telangana</option>
                    <option>Tripura</option>
                    <option>Uttar Pradesh</option>
                    <option>Uttarakhand</option>
                    <option>West Bengal</option>

                    <option>Andaman and Nicobar Islands</option>
                    <option>Chandigarh</option>
                    <option>Dadra and Nagar Haveli and Daman and Diu</option>
                    <option>Delhi</option>
                    <option>Ladakh</option>
                    <option>Lakshadweep</option>
                    <option>Puducherry</option>

                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                </div>

                <textarea name="details" rows={5} placeholder="Tell me about yourself" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f9952] text-gray-800 font-medium" />
                <button type="submit" className="flex gap-2 justify-center w-full bg-[#0f9952] hover:bg-[#0c7f44] text-white py-3 px-6 rounded-lg font-bold text-lg shadow">
                  <Send /> Send Message
                </button>
                <p className="text-xs text-gray-500 text-center pt-2">
                  We respect your privacy. Your information will only be used for project communication.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
