import Button from "../components/common/Button";
import HeaderToeicHome from "../components/layouts/HeaderToeicHome";
import FaqSectionToeicHome from "../components/layouts/FaqSectionToeicHome";

const ToeicHome = () => {
  return (
    <div className="w-full">
      <HeaderToeicHome />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Luyện Thi TOEIC Online Cùng DTT
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Nền tảng học DTT thông minh – cá nhân hóa lộ trình, rút ngắn thời
            gian ôn luyện.
          </p>
          <Button size="lg" className="bg-yellow-400 text-black font-semibold">
            Đăng ký ngay
          </Button>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Các Khóa Học TOEIC Nổi Bật
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {["700+", "800+", "900+"].map((target) => (
              <div
                key={target}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition"
              >
                <img
                  src={`https://picsum.photos/400/250?random=${target}`}
                  alt={`TOEIC ${target}`}
                  className="rounded-xl mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">TOEIC {target}</h3>
                <p className="text-gray-600 mb-4">
                  Khóa học dành cho học viên mong muốn đạt mục tiêu TOEIC{" "}
                  {target}.
                </p>
                <Button className="w-full">Xem chi tiết</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Vì Sao Chọn DTT TOEIC?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">
                Lộ trình cá nhân hóa
              </h3>
              <p className="text-gray-600">
                Xây dựng kế hoạch học tập phù hợp từng học viên.
              </p>
            </div>
            <div>
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Theo dõi tiến độ</h3>
              <p className="text-gray-600">
                Báo cáo chi tiết, theo sát hành trình học TOEIC của bạn.
              </p>
            </div>
            <div>
              <div className="text-5xl mb-4">👩‍🏫</div>
              <h3 className="text-xl font-semibold mb-2">
                Giảng viên chất lượng
              </h3>
              <p className="text-gray-600">
                Đội ngũ thầy cô giàu kinh nghiệm, hỗ trợ nhiệt tình.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-100 py-16">
        <FaqSectionToeicHome />
      </section>

      {/* Call To Action */}
      <section className="bg-indigo-600 text-white py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Sẵn sàng chinh phục TOEIC?
        </h2>
        <p className="mb-8">
          Hàng nghìn học viên đã đạt mục tiêu cùng DTT. Bạn đã sẵn sàng chưa?
        </p>
        <Button size="lg" className="bg-yellow-400 text-black font-semibold">
          Đăng ký ngay
        </Button>
      </section>
    </div>
  );
};

export default ToeicHome;
