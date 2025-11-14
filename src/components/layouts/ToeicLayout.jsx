import React from "react";
import HeaderToeicHome from "./HeaderToeicHome";
import Footer from "../common/Footer";
import VocabTranslator from "../common/VocabTranslator";

const ToeicLayout = ({ children, showFooter = false }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <HeaderToeicHome />
      </div>

      {/* Main Content with top padding to avoid header overlap */}
      <main className="w-full pt-20 md:pt-24 lg:pt-28">{children}</main>

      {/* Footer (optional) */}
      {showFooter && <Footer />}
      {/* Floating vocabulary translator UI */}
      <VocabTranslator />
    </div>
  );
};

export default ToeicLayout;
