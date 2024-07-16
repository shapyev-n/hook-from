import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import "./UploadFile.scss";
import axios from "axios";

interface IFormInput {
  title: string;
  email: string;
  file: string[];
  _id: number;
  img: string;
}

const UploadFile = () => {
  const { register, handleSubmit } = useForm<IFormInput>();
  const [state, setState] = useState<IFormInput[] | null>(null);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const file = data.file[0];
    const formData = new FormData();
    formData.append("file", file);

    const { data: responseImage } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/upload/file`,
      formData
    );

    const newData = {
      title: data.title,
      email: data.email,
      img: responseImage.url,
      isCompleted: false,
    };

    const { data: responseData } = await axios.post(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/ab7c1beae8c32e29f8a66fd422a017cc/data`,
      newData
    );
    console.log(responseData);
  };

  const fetchData = async () => {
    try {
      const { data: responseGetData } = await axios.get(
        import.meta.env.VITE_BACKEND_URL_DATA
      );
      setState(responseGetData);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container">
      <h1>UploadFile</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="title"
          {...register("title", { required: true })}
        />
        <input
          type="text"
          placeholder="email"
          {...register("email", {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          })}
        />
        <input type="file" {...register("file", { required: true })} />
        <button type="submit"> Загрузить задачу</button>
      </form>
      <div className="content">
        {state?.map((el) => (
          <div key={el._id} className="box">
            <div className="txt">
              <p className="email">{el.email}</p>
              <div>
                <p>title:</p>
                <p className="title">{el.title}</p>
              </div>
              <p className="id">
                <span>_id: </span>
                {el._id}
              </p>
            </div>
            <img src={el.img} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadFile;
