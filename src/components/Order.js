import React from 'react'
import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom"
import * as Yup from "yup";
import "./Order.css"

const extras = ["Pepperoni", "Domates", "Biber", "Sosis", "Mısır", "Roka", "Kanada Jambonu", "Sucuk", "Ananas", "Tavuk Izgara", "Jalepeno", "Kabak", "Soğan", "Sarımsak"];

const Order = () => {

  // ___________________State'leri tanımlama:____________________//
  const [checkedExtras, setCheckedExtras] = useState([]);
  const [pizzaPrice, setPizzaPrice] = useState(0);
  // eslint-disable-next-line
  const [pizzaThin, setPizzaThin] = useState("");
  const [pizzaRate, setPizzaRate] = useState("...");
  const [pizzaStock, setPizzaStock] = useState("...");
  const [totalPrice, setTotalPrice] = useState(0)
    // eslint-disable-next-line
  const [orderAddress, setOrderAddress] = useState("");
    // eslint-disable-next-line
  const [orderNote, setOrderNote] = useState("");
  const [numberOfPizzas, SetNumberOfPizzas] = useState(1);
  const [formDolumu, setformDolumu] = useState(false);
  const [form, setForm] = useState({});
  const history = useHistory();

  // ___________________YUP BİLEŞENLERİ:____________________//

  // State, hata mesajlarını yazdıracağımız bölüm. Hata mesajlarının içine gireceği state'lerin başlangıç değerleri boş string olmalı (S7G3 Dersi)
  const [formErrors, setFormErrors] = useState({
    size: "",
    thickness: "",
    orderers_address: "",
    special_note: "",
  });
  // Form şemasına hata mesajlarını yazıyoruz.
  const formSchema = Yup.object().shape({
    size: Yup.string().required("En az bir adet seçim yapmalısınız."),
    thickness: Yup.string().required("Pizza hamuru kalınlığını seçiniz."),
    orderers_address: Yup.string().required("Lütfen bu alanı doldurunuz..").min(3, "İsim en az 2 karakter olmalıdır"),
    special_note: Yup.string().required("Lütfen bu alanı doldurunuz..").min(3, "Not bölümü en az iki karakter olabilir."),
  })

  useEffect(() => {
    console.warn("error:", formErrors);
  }, [formErrors]);

  // ___________________FORM DEĞİŞİKLİKLERİ İLE STATE + FORM GÜNCELLEMESİ + YUP VALİDASYONU____________________//

  // Form Nesnelerini Dinleme-1 (toplanabilenler):
  const changeHandler = (e) => {
    // Destructring ile target açılımı:
    const { type, name, value } = e.target
    // Pizza Boyutu Seçimi
    if (type === "radio") {
      if (value === "small") { setPizzaPrice(100); setPizzaRate(4.2); setPizzaStock(15) }
      if (value === "medium") { setPizzaPrice(150); setPizzaRate(4.5); setPizzaStock(10) }
      if (value === "large") { setPizzaPrice(200); setPizzaRate(4.9); setPizzaStock(5) }
    }
    // Pizza Hamuru Seçimi
    if (type === "option") { setPizzaThin(value) }
    // İsim Soyisim ve Adres Bilgileri:
    if (type === "text") { setOrderAddress(value) }
    if (type === "text-area") { setOrderNote(value) }

    // FORMA VERİ YÜKLEME:
    setForm({ ...form, [name]: value });

    // YUP mesajlarını state'e ekleme:
    Yup.reach(formSchema, name)
      .validate(value)
      .then((valid) => {
        setFormErrors({ ...formErrors, [name]: " " });
      })
      .catch((err) => {
        setFormErrors({ ...formErrors, [name]: err.errors[0] });
      });
  }

  useEffect(() => {
    formSchema.isValid(form).then((valid) => {
      setformDolumu(valid)
    })
  }, [form, formSchema]);

  // Form Nesnelerini Dinleme-2:

  // Ek Malzeme Seçimi
  const changeHandlerExtras = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setCheckedExtras([...checkedExtras, value]);
    } else {
      setCheckedExtras(checkedExtras.filter((item) => item !== value));
    }
  }

  // FORMA VERİ YÜKLEME:
  // useEffect içine eklenmeli
  useEffect(() => {
    setForm({ ...form, extra_materials: checkedExtras });
  }, [checkedExtras]);

  // Form Nesnelerini Dinleme-3:

  // Pizza Sayısı:
  const changeHandlerCounter = (e) => {
    e.stopPropagation(); // stops event bubling
    if (e.target.id === "decrease") { numberOfPizzas > 0 && SetNumberOfPizzas(numberOfPizzas - 1) }
    else { numberOfPizzas < pizzaStock && SetNumberOfPizzas(numberOfPizzas + 1) }
  }

  // FORMA VERİ YÜKLEME:
  // useEffect içine eklenmeli
  useEffect(() => {
    setForm({ ...form, number_of_pizzas: numberOfPizzas });
  }, [numberOfPizzas]);

  // Form Nesnesini Konsol'da kontrol etme:
  useEffect(() => { console.log("Güncellenen form listesi:", form) }, [form]);

  useEffect(() => {
    setTotalPrice((pizzaPrice * numberOfPizzas) + (checkedExtras.length * 5 * numberOfPizzas));
  }, [pizzaPrice, numberOfPizzas, checkedExtras])

  // HAZIRLANAN FORMU SUBMIT + POST + DATA KONTROL 

  const handleSubmit = (e) => {
    e.preventDefault(); // stops defaults behavior
    e.stopPropagation(); // stops event bubling
    if (formDolumu) {
      axios
        .post("https://reqres.in/api/orders", form)
        .then((res) => {
          console.log("Post Edilen Data Kontrol Edildi:", res.data);
          // todo: redirect to success page
          // tepede: history = useHistory();
          history.push("/success");
        })
        .catch(() => {
          // todo: hata mesajını ekranda göster
          // hata mesajını sistem yöneticisine gönder
        });
    } else { console.log("hatalı veri....") }
  }

  return (
    <div className='pizza-page'>

      {/* NAVIGASYON bölümü burada: */}
      <div className="order-container">
        <div className="header-link-bar">
          <ul>
            <li><Link to="/">Anasayfa</Link></li>
            <span>-</span>
            <li><Link to="/">Seçenekler</Link></li>
            <span>-</span>
            <li><Link to="/pizza">Siparişi Oluştur</Link></li>
          </ul>
        </div>
      </div>

      {/* ÜRÜN BİLGİSİ bölümünü burada yaptım: */}

      <div className='product-details'>
        <div className='form-bar'>
          <br />
          <div className='product-name'>
            <h4>Position Absolute Acı Pizza</h4>
          </div>
          <br />
          <div className='product-count-rate-stock'>
            <h4>{pizzaPrice}₺</h4>
            <h6>{pizzaRate}/5.0</h6>
            <h6>({pizzaStock} Adet)</h6>
          </div>
          <br />
          <div className='product-detail-paragraph'>
            <p>Frontend Dev olarak hala position:absolute kullanıyorsan bu çok acı pizza tam sana göre. Pizza, domates, peynir ve genellikle çeşitli diğer malzemelerle kaplanmış, daha sonra geleneksel olarak odun ateşinde bir fırında yüksek sıcaklıkta pişirilen, genellikle yuvarlak, düzleştirilmiş mayalı buğday bazlı hamurdan oluşan İtalyan kökenli lezzetli bir yemektir..Küçük bir pizzaya bazen pizzetta denir.</p>
          </div>

          {/* FORM: */}

          <form id="pizza-form" onSubmit={handleSubmit}>

            {/* FORM girdilerinin birinci bölümü PİZZA TERCİHLERİ burada: */}

            <div className='form-part-one'>
              <div className="form-first-choice-panel">
                <div className="select-pizza-size">
                  <h5>Boyut Seçin <span style={{ color: "#CE2829" }}>*</span></h5>
                  <div>
                    <input type="radio" id="small" name="size" value="small" onChange={changeHandler} />
                    <label htmlFor="small">Küçük</label>
                  </div>
                  <div>
                    <input type="radio" id="medium" name="size" value="medium" onChange={changeHandler} />
                    <label htmlFor="medium">Orta</label>
                  </div>
                  <div>
                    <input type="radio" id="large" name="size" value="large" onChange={changeHandler} />
                    <label htmlFor="large">Büyük</label>
                  </div>
                  {formErrors.size && <h6> {formErrors.name} </h6>}

                </div>

                <div className="select-pizza-weight">
                  <h5>Hamur Seçin <span style={{ color: "#CE2829" }}>*</span></h5>

                  <select id="size-dropdown" name="thickness" defaultValue="none" onChange={changeHandler}>
                    <option value="none" disabled>Hamur Kalınlığı:</option>
                    <option type="option" value="small">İnce</option>
                    <option type="option" value="normal">Normal</option>
                  </select>
                  {formErrors.thickness && <h6> {formErrors.name} </h6>}

                </div>
              </div>
            </div>

            {/* FORM girdilerinin ikinci bölümü CHECKBOX - LİSTESİ burada: */}

            <div className='form-part-two'>
              <div className='form-part-two-details'>
                <h5>Ek Malzemeler</h5>
                <p>En fazla 10 ürün seçebilirsiniz. Her ürün için 5₺ eklenecektir.</p>
              </div>
              <div className='form-part-two-checklist'>
                {extras.map((item, index) => {
                  return (
                    <div key={index} >
                      <input type="checkbox" id={index} name="extra_materials" disabled={checkedExtras.length === 10 && !checkedExtras.includes(item)} value={item} onChange={changeHandlerExtras}></input>
                      <label htmlFor={index}>{item}</label>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* FORM girdilerinin üçüncü bölümü SİPARİŞ NOTLARI ve AD SOYAD ADRES burada: */}

            <div className='form-part-three'>

              <label htmlFor="name-input" className="orderer-information"><h5>İsim Bilgisi:</h5></label>
              <textarea type="text" id="name-input" placeholder='Örn. Gözde Apak, İzmir (Min. 2 karakter içermelidir)' name="orderers_address" onChange={changeHandler}></textarea>
              {<h6> {formErrors.orderers_address} </h6>}

              <label htmlFor="special-text" className="special-text"><h5>Sipariş Notu</h5></label>
              <textarea type="text-area" id="special-text" placeholder='Siparişine eklemek istediğin bir not var mı?' name="special_note" onChange={changeHandler}></textarea>
              {<h6> {formErrors.special_note} </h6>}

            </div>

            <hr />

            {/* FORM girdilerinin dördüncü bölümü SİPARİŞ ADEDİ burada: */}

            <div className='form-part-four'>
              <div className='form-part-four-numberof'>
                <button type="button" id="decrease" onClick={changeHandlerCounter} disabled={pizzaPrice === 0}>-</button>
                <h4 data-test-id="numberofpizza">{numberOfPizzas}</h4>
                <button type="button" id="increase" onClick={changeHandlerCounter} disabled={pizzaPrice === 0}>+</button>
              </div>
                
              {/* FORM girdilerinin son bölümü SİPARİŞ ÖZETİ ve SİPARİŞ VER burada: */}

              <div className='form-part-four-total'>
                <div className='text-container'>
                  <h5>Sipariş Toplamı</h5>
                  <div className='between'>
                    <h6>Ekstra Seçimler</h6>
                    <h6>{(checkedExtras.length * 5 * numberOfPizzas)}₺</h6>
                  </div>
                  <div className='between'>
                    <h6 id="important">Toplam</h6>
                    <h6 id="important">{totalPrice}₺</h6>
                  </div>
                </div>
                <div>
                  {/* <button id="button-order" type='submit' disabled={!formDolumu} ><a href="/final"> SİPARİŞİ VER </a></button> */}
                  <button id="button-order" type='submit' disabled={!formDolumu} >SİPARİŞİ VER</button>

                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Order