import hero from "../../assets/herobg.png"
import banner from "../../assets/banner.png"
import { Link } from "react-router"

export default function Home() {
  return (
    <div className="text-white">

      {/* HERO */}
      <section
        className="relative h-[45vh] flex items-center justify-center text-center"
        style={{
          backgroundImage: `url(${hero})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >

        {/* overlay */}
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10 px-6">

          <h2 className="text-4xl font-bold mb-3">
            توب شيف
          </h2>

          <p className="text-lg text-gray-300 mb-6">
            لحوم طازجة يومياً
          </p>

          <Link to="/shop">
          <button className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg">
            تصفح المنتجات
          </button>
          </Link>
        </div>

      </section>


      {/* BANNER */}
      <section className="py-10 px-4">

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 items-center">

          <img
            src={banner}
            className="rounded-xl shadow-lg"
          />

          <div>

            <h3 className="text-2xl font-bold mb-3">
              أفضل اللحوم الطازجة
            </h3>

            <p className="text-gray-400">
              لحوم مختارة بعناية يومياً لضمان أفضل جودة وطعم.
            </p>

          </div>

        </div>

      </section>

    </div>
  )
}