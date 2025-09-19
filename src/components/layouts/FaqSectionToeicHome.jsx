import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const faqs = [
  {
    question: "Thời gian sử dụng Lộ Trình học TOEIC",
    answer:
      "Bạn có thể sử dụng Lộ Trình học TOEIC trong vòng 12 tháng kể từ ngày kích hoạt tài khoản.",
  },
  {
    question: "Thông tin thanh toán",
    answer:
      "Thanh toán có thể thực hiện qua chuyển khoản ngân hàng, ví điện tử hoặc thẻ tín dụng. Tất cả giao dịch đều được bảo mật.",
  },
  {
    question: "Hướng dẫn học hiệu quả",
    answer:
      "Bạn nên luyện tập hàng ngày, làm đề thi thử định kỳ và theo dõi tiến trình để đạt kết quả tốt nhất.",
  },
  {
    question: "Quy định về việc sử dụng tài khoản",
    answer:
      "Mỗi tài khoản chỉ dành cho 1 người sử dụng. Việc chia sẻ tài khoản có thể dẫn đến khóa tài khoản.",
  },
];

const FaqSectionToeicHome = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-screen-3xl 3xl:px-[254px] w-full px-4 md:px-8 lg:px-12 2xl:px-[112px]">
      <div className="3xl:gap-x-[176px] space-y-6 md:space-y-8 lg:flex lg:gap-x-8 lg:space-y-0">
        {/* Left title */}
        <div className="grow">
          <div>
            <div className="relative">
              <span className="-my-2 inline-block overflow-hidden py-2">
                <span
                  className="font-svn-poppins text-[32px] md:text-[44px] font-bold leading-10 md:leading-[60px]
      bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
                >
                  DTT
                </span>
              </span>
              <span className="-my-2 inline-block overflow-hidden py-2">
                <span
                  className="font-svn-poppins text-[32px] md:text-[44px] font-bold leading-10 md:leading-[60px]
      bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
                >
                  giúp
                </span>
              </span>
              <span className="-my-2 inline-block overflow-hidden py-2">
                <span
                  className="font-svn-poppins text-[32px] md:text-[44px] font-bold leading-10 md:leading-[60px]
      bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
                >
                  bạn
                </span>
              </span>
            </div>
            <div className="relative">
              {["tháo", "gỡ", "mọi", "thắc", "mắc"].map((word, i) => (
                <span
                  key={i}
                  className="-my-2 inline-block overflow-hidden py-2"
                >
                  <span className="font-svn-poppins text-[32px] md:text-[44px] font-bold leading-10 md:leading-[60px]">
                    {word}&nbsp;
                  </span>
                </span>
              ))}
            </div>
          </div>

          <a>
            <button
              onClick={() => navigate("/toeic-home/contact")}
              className="tracking-[0.08px] cursor-pointer items-center justify-center gap-2 disabled:cursor-not-allowed rounded-[32px] disabled:bg-gray-100 disabled:text-gray-400 p-4 text-md font-bold bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 mt-6 hidden w-[251px] lg:flex hover:shadow-lg"
            >
              Đặt thêm câu hỏi
            </button>
          </a>
        </div>

        {/* Right FAQ list */}
        <div className="3xl:w-[59%] lg:w-[55%] 2xl:w-[57%]">
          <div className="space-y-3 md:space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="prevent-lenis-parent-target inline-block w-full"
              >
                <div
                  className="prevent-lenis-target relative rounded-xl bg-white p-4 border border-blue-200"
                  data-lenis-prevent="true"
                >
                  <div
                    className="flex cursor-pointer items-center gap-x-2"
                    onClick={() => toggleFaq(i)}
                  >
                    <h3 className="grow text-base font-semibold text-gray-800">
                      {faq.question}
                    </h3>
                    <span className="text-[#152946]">
                      {openIndex === i ? "−" : "+"}
                    </span>
                  </div>

                  {openIndex === i && (
                    <div className="mt-2 text-gray-600 text-sm">
                      {faq.answer}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Button mobile */}
          <div className="mt-3 flex w-full justify-center md:mt-8 lg:hidden">
            <a className="block w-full md:w-fit" href="/vi/toeic#contact">
              <button className="inline-flex tracking-[0.08px] cursor-pointer items-center justify-center gap-2 disabled:cursor-not-allowed rounded-[32px] p-4 text-md font-bold bg-branding-100 text-branding-500 hover:bg-branding-100 focus:ring-2 focus:ring-branding-100 w-full md:w-[251px]">
                Đặt thêm câu hỏi
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqSectionToeicHome;
