import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useNotification } from "../../../commons/Notifications/NotificationProvider";
import Loader from "@/components/Loader/Loader";
import { helHttp } from "../../../helpers/helpHttp";
import { useSelector } from "react-redux";

const SettingPage = ({ settings, setError }) => {
  let user = useSelector((state) => state.user.user);

  const [loading, setLoading] = useState(false);
  const [newLogo, setNewLogo] = useState(null);
  const dispatch = useNotification();

  const api = helHttp();
  const url = `${import.meta.env.VITE_BACKEND_API}/settings`;

  const handleCancel = () => {
    console.log("Cancel");
  };
  return (
    <Formik
      initialValues={{
        Facebook: "",
        Instagram: "",
        Twitter: "",
        Whatsapp: "",
        email: "",
        logo: "",
        phone: "",
        title_color: "#000000",
        paragraph_color: "#000000",
        button_color: "#531253",
        effect_color: "#531253",
        error_color: "#f44336",
        divisor_color: "#170312",
        title_font_size: "30px",
        paragraph_font_size: "16px",
      }}
      validate={(values) => {
        const errors = {};
        if (
          values.Facebook.length > 0 &&
          !/(?:https?:\/\/)?(?:www\.)?(?:facebook|fb|m\.facebook)\.(?:com|me)\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-\.]+)(?:\/)?/i.test(
            values.Facebook
          )
        ) {
          errors.Facebook = "Ingrese un perfil válido para Facebook";
        }

        if (
          values.Twitter.length > 0 &&
          !/http(?:s)?:\/\/(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)/.test(
            values.Twitter
          )
        ) {
          errors.Twitter = "Ingrese un perfil válido para Twitter";
        }

        if (
          values.Instagram.length > 0 &&
          !/(?:(?:http|https):\/\/)?(?:www\.)?(?:instagram\.com|instagr\.am|twitter\.com)\/([A-Za-z0-9-_\.]+)/im.test(
            values.Instagram
          )
        ) {
          errors.Instagram = "Ingrese un perfil válido para Instagram";
        }

        if (
          values.Whatsapp.length > 0 &&
          !/(?:(?:http|https):\/\/)?(?:www\.)?(?:wa\.me)\/.*$/.test(
            values.Whatsapp
          )
        ) {
          errors.Whatsapp = "Ingrese un link válido para Whatsapp";
        }

        if (
          values.email.length > 0 &&
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.email = "Email inválido";
        }

        if (values.phone.length > 0 && !/^[0-9*\s()+?-]*$/.test(values.phone)) {
          errors.phone = "El teléfono solo admite números, -, +, y ()";
        }

        if (
          values.title_color.length > 0 &&
          !/^#?([a-fA-F0-9]){6}$/.test(values.title_color)
        ) {
          errors.title_color = "Formato Hexadecimal #rrggbb";
        }

        if (
          values.paragraph_color.length > 0 &&
          !/^#?([a-fA-F0-9]){6}$/.test(values.paragraph_color)
        ) {
          errors.paragraph_color = "Formato Hexadecimal #rrggbb";
        }

        if (
          values.button_color.length > 0 &&
          !/^#?([a-fA-F0-9]){6}$/.test(values.button_color)
        ) {
          errors.button_color = "Formato Hexadecimal #rrggbb";
        }

        if (
          values.effect_color.length > 0 &&
          !/^#?([a-fA-F0-9]){6}$/.test(values.effect_color)
        ) {
          errors.effect_color = "Formato Hexadecimal #rrggbb";
        }
        if (
          values.error_color.length > 0 &&
          !/^#?([a-fA-F0-9]){6}$/.test(values.error_color)
        ) {
          errors.error_color = "Formato Hexadecimal #rrggbb";
        }
        if (
          values.divisor_color.length > 0 &&
          !/^#?([a-fA-F0-9]){6}$/.test(values.divisor_color)
        ) {
          errors.divisor_color = "Formato Hexadecimal #rrggbb";
        }

        if (
          values.paragraph_font_size.length > 0 &&
          !/^([0-9]){1,2}px$/.test(values.paragraph_font_size)
        ) {
          errors.paragraph_font_size = "Formato en pixeles. Ej 16px";
        }
        if (
          values.title_font_size.length > 0 &&
          !/^([0-9]){1,2}px$/.test(values.title_font_size)
        ) {
          errors.title_font_size = "Formato en pixeles. Ej 30px";
        }

        return errors;
      }}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          // console.log("Logo", values.logo);
          setLoading(true);
          /* upload-image */
          if (newLogo) {
            console.log("Enviar", newLogo);
            const fd = new FormData();
            fd.append("image", newLogo, values.logo);

            const response = await fetch(`${url}/upload-file`, {
              method: "POST",
              body: fd,
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            });
            const uploadImg = await response.json();
            values.logo = uploadImg.image;

            if (uploadImg.statusCode) {
              throw uploadImg;
            }
          }

          const data = await api.put(url, { body: { data: values } });
          if (data.statusCode) {
            throw data;
          }
          dispatch({
            type: "SUCCESS",
            message: "Configuración modificada!",
          });
        } catch (err) {
          dispatch({
            type: "ERROR",
            message: "Error modificando la configuración",
          });
          setError(`${err.statusCode}: ${err.error} - ${err.message}`);
          console.log(err);
        } finally {
          setSubmitting(false);
          setLoading(false);
        }
      }}
    >
      {({ isSubmitting, setFieldValue, values }) => {
        useEffect(() => {
          if (settings) {
            setFieldValue("Twitter", settings.Twitter || "");
            setFieldValue("Facebook", settings.Facebook || "");
            setFieldValue("Instagram", settings.Instagram || "");
            setFieldValue("Whatsapp", settings.Whatsapp || "");
            setFieldValue("email", settings.email || "");
            setFieldValue("phone", settings.phone || "");
            setFieldValue("logo", settings.logo || "");
            setFieldValue("title_color", settings.title_color || "#531253");
            setFieldValue(
              "paragraph_color",
              settings.paragraph_color || "#4c545d"
            );
            setFieldValue("button_color", settings.button_color || "#531253");
            setFieldValue("effect_color", settings.effect_color || "#531253");
            setFieldValue("error_color", settings.error_color || "#f44336");
            setFieldValue("divisor_color", settings.divisor_color || "#170312");
            setFieldValue(
              "title_font_size",
              settings.title_font_size || "30px"
            );
            setFieldValue(
              "paragraph_font_size",
              settings.paragraph_font_size || "16px"
            );
          }
          console.log("Settings", settings);
        }, [settings]);

        return (
          <>
            {loading && <Loader />}
            {!loading && (
              <Form className="form__container">
                <div className="formulario">
                  <div>
                    <label htmlFor="Twitter">Twitter</label>
                    <Field
                      className="form__input"
                      type="text"
                      name="Twitter"
                      placeholder="https://twitter.com/jourdanmau"
                    />
                    <ErrorMessage
                      name="Twitter"
                      render={(msg) => <div className="error">{msg}</div>}
                    />
                  </div>
                  <div>
                    <label htmlFor="Facebook">Fecebook</label>
                    <Field
                      className="form__input"
                      type="text"
                      name="Facebook"
                      placeholder="https://www.facebook.com/mauricio.jourdan.33"
                    />
                    <ErrorMessage
                      name="Facebook"
                      render={(msg) => <div className="error">{msg}</div>}
                    />
                  </div>
                  <div>
                    <label htmlFor="Instagram">Instagram</label>
                    <Field
                      className="form__input"
                      type="text"
                      name="Instagram"
                      placeholder="https://www.instagram.com/mauricio.jourdan.33/"
                    />
                    <ErrorMessage
                      name="Instagram"
                      render={(msg) => <div className="error">{msg}</div>}
                    />
                  </div>
                  <div>
                    <label htmlFor="Whatsapp">Whatsapp</label>
                    <Field
                      className="form__input"
                      type="text"
                      name="Whatsapp"
                      placeholder="https://wa.me/5491158046525?text=Hola, quiero rebir información"
                    />
                    <ErrorMessage
                      name="Whatsapp"
                      render={(msg) => <div className="error">{msg}</div>}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone">Teléfono</label>
                    <Field
                      className="form__input"
                      type="text"
                      name="phone"
                      placeholder="(cod) xxxx-xxxx"
                    />
                    <ErrorMessage
                      name="phone"
                      render={(msg) => <div className="error">{msg}</div>}
                    />
                  </div>
                  <div>
                    <label htmlFor="email">Email</label>
                    <Field
                      className="form__input"
                      type="email"
                      name="email"
                      placeholder="email@dominio.com"
                    />
                    <ErrorMessage
                      name="email"
                      render={(msg) => <div className="error">{msg}</div>}
                    />
                  </div>
                  <div className="settings__logo">
                    <label htmlFor="logo">Logo</label>
                    <input
                      id="logo"
                      name="logo"
                      accept="image/png, image/jpg, image/jpeg, image/svg"
                      type="file"
                      onChange={(event) => {
                        setNewLogo(event.currentTarget.files[0]);
                        setFieldValue(
                          "logo",
                          event.currentTarget.files[0].name
                        );
                      }}
                    />
                  </div>
                  <div>
                    <img className="logo" src={values.logo} alt={values.logo} />
                  </div>
                  <div>
                    <label htmlFor="title_color">Color de títulos</label>
                    <input
                      className="form__input--color"
                      type="color"
                      value={values.title_color}
                      onChange={(e) =>
                        setFieldValue("title_color", e.target.value)
                      }
                    />
                    <Field
                      value={values.title_color}
                      type="text"
                      id="title_color"
                      name="title_color"
                      placeholder="#531253"
                      className="form__input form__input--colorDesc"
                    />
                    <ErrorMessage
                      name="title_color"
                      render={(msg) => <div className="error">{msg}</div>}
                    />
                  </div>
                  <div>
                    <label htmlFor="paragraph_color">Color de párrafos</label>
                    <input
                      className="form__input--color"
                      type="color"
                      value={values.paragraph_color}
                      onChange={(e) =>
                        setFieldValue("paragraph_color", e.target.value)
                      }
                    />
                    <Field
                      value={values.paragraph_color}
                      type="text"
                      id="paragraph_color"
                      name="paragraph_color"
                      placeholder="#4c545d"
                      className="form__input form__input--colorDesc"
                    />
                    <ErrorMessage
                      name="paragraph_color"
                      render={(msg) => <div className="error">{msg}</div>}
                    />
                  </div>
                  <div>
                    <label htmlFor="button_color">Color de botones</label>
                    <input
                      className="form__input--color"
                      type="color"
                      value={values.button_color}
                      onChange={(e) =>
                        setFieldValue("button_color", e.target.value)
                      }
                    />
                    <Field
                      value={values.button_color}
                      type="text"
                      id="button_color"
                      name="button_color"
                      placeholder="#531253"
                      className="form__input form__input--colorDesc"
                    />
                    <ErrorMessage
                      name="button_color"
                      render={(msg) => <div className="error">{msg}</div>}
                    />
                  </div>
                  <div>
                    <label htmlFor="effect_color">Color de transiciones</label>
                    <input
                      className="form__input--color"
                      type="color"
                      value={values.effect_color}
                      onChange={(e) =>
                        setFieldValue("effect_color", e.target.value)
                      }
                    />
                    <Field
                      value={values.effect_color}
                      type="text"
                      id="effect_color"
                      name="effect_color"
                      placeholder="#531253"
                      className="form__input form__input--colorDesc"
                    />
                    <ErrorMessage
                      name="effect_color"
                      render={(msg) => <div className="error">{msg}</div>}
                    />
                  </div>

                  <div>
                    <label htmlFor="error_color">Color de errores</label>
                    <input
                      className="form__input--color"
                      type="color"
                      value={values.error_color}
                      onChange={(e) =>
                        setFieldValue("error_color", e.target.value)
                      }
                    />
                    <Field
                      value={values.error_color}
                      type="text"
                      id="error_color"
                      name="error_color"
                      placeholder="#f44336"
                      className="form__input form__input--colorDesc"
                    />
                    <ErrorMessage
                      name="error_color"
                      render={(msg) => <div className="error">{msg}</div>}
                    />
                  </div>

                  <div>
                    <label htmlFor="divisor_color">Color de divisor</label>
                    <input
                      className="form__input--color"
                      type="color"
                      value={values.divisor_color}
                      onChange={(e) =>
                        setFieldValue("divisor_color", e.target.value)
                      }
                    />
                    <Field
                      value={values.divisor_color}
                      type="text"
                      id="divisor_color"
                      name="divisor_color"
                      placeholder="#170312"
                      className="form__input form__input--colorDesc"
                    />
                    <ErrorMessage
                      name="divisor_color"
                      render={(msg) => <div className="error">{msg}</div>}
                    />
                  </div>

                  <div>
                    <label htmlFor="title_font_size">
                      Tamaño de fuente para títulos
                    </label>
                    <Field
                      className="form__input"
                      type="text"
                      name="title_font_size"
                      placeholder="30px"
                    />
                    <ErrorMessage
                      name="title_font_size"
                      render={(msg) => <div className="error">{msg}</div>}
                    />
                  </div>

                  <div>
                    <label htmlFor="paragraph_font_size">
                      Tamaño de fuente para párrafos
                    </label>
                    <Field
                      className="form__input"
                      type="text"
                      name="paragraph_font_size"
                      placeholder="16px"
                    />
                    <ErrorMessage
                      name="paragraph_font_size"
                      render={(msg) => <div className="error">{msg}</div>}
                    />
                  </div>

                  {/* ACTIONS */}
                  <div className="wide actions">
                    <button
                      onClick={handleCancel}
                      className="btn"
                      type="button"
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </button>

                    <button
                      className="btn btn__primary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Modificar
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </>
        );
      }}
    </Formik>
    // </>
  );
};
export default SettingPage;