export default function Section2() {
  return (
    <section className="secondSection__items" aria-label="Контакты">
      <div className="container">
        <div className="py-[100px] px-5">
          <h2 className="font-extrabold text-4xl text-[#144F24]">
            Возникли вопросы?
          </h2>
          <p className="mt-3 text-gray-700 max-w-lg">
            Напишите нам в WhatsApp — поможем подобрать препарат и оформить заказ.
          </p>
          <a
            href="https://wa.me/996552225101"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full max-w-[480px] rounded-xl text-white font-bold text-lg bg-[#144F24] py-5 text-center mt-5 hover:bg-[#0d3a18] transition-colors"
          >
            ЗАДАТЬ ВОПРОС
          </a>
        </div>
      </div>
    </section>
  );
}
