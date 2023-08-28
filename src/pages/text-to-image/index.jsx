import Head from "next/head";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import Axios from "axios";
import global_data from "../../../public/data/global";

const TextToImage = () => {

    const [textPrompt, setTextPrompt] = useState("a dog");

    const [paintingURL, setPaintingURL] = useState("");

    const [isWaitStatus, setIsWaitStatus] = useState(false);

    const [errorMsg, setErrorMsg] = useState("");

    const [categorySelectedIndex, setCategorySelectedIndex] = useState(0);

    const [styleSelectedIndex, setStyleSelectedIndex] = useState(0);

    const [modelName, setModelName] = useState("");

    const [imageType, setImageType] = useState("vertical");

    const [dimentions, setDimentions] = useState({});

    const [dimentionsInCm, setDimentionsInCm] = useState("50x70");

    const [categoriesData, setCategoriesData] = useState([]);

    const [categoryStyles, setCategoryStyles] = useState([]);

    const [tempModelName, setTempModelName] = useState("");

    const [tempDimentionsInCm, setTempDimentionsInCm] = useState("50x70");

    const [tempImageType, setTempImageType] = useState("vertical");

    useEffect(() => {
        Axios.get(`${process.env.BASE_API_URL}/text-to-image/categories/all-categories-data`)
            .then((res) => {
                const result = res.data;
                if (typeof result === "string") {
                    console.log(result);
                } else {
                    console.log(result);
                    setCategoriesData(result);
                    Axios.get(`${process.env.BASE_API_URL}/text-to-image/styles/category-styles-data?categoryName=${result[0].name}`)
                        .then((res) => {
                            const categoryStylesTemp = res.data;
                            setCategoryStyles(categoryStylesTemp);
                            const tempModelName = categoryStylesTemp[0].modelName;
                            setTempModelName(tempModelName);
                            setModelName(tempModelName);
                            setDimentions({
                                width: 640,
                                height: 896,
                            });
                            setPaintingURL(`${process.env.BASE_API_URL}/assets/images/generatedImages/previewImageForCanvasInTextToImage.png`);
                        })
                        .catch((err) => console.log(err));
                }
            })
            .catch((err) => console.log(err));
    }, []);

    const handleSelectCategory = (index) => {
        setCategorySelectedIndex(index);
        Axios.get(`${process.env.BASE_API_URL}/text-to-image/styles/category-styles-data?categoryName=${categoriesData[index].name}`)
            .then((res) => {
                setCategoryStyles(res.data);
                setStyleSelectedIndex(0);
                const tempModelName = res.data[0].modelName;
                setTempModelName(tempModelName);
                setModelName(tempModelName);
                const dimsIndex = global_data.modelsDimentions[tempModelName][imageType].findIndex((el) => el.inCm == dimentionsInCm);
                setDimentions({
                    width: global_data.modelsDimentions[tempModelName][imageType][dimsIndex].inPixel.width,
                    height: global_data.modelsDimentions[tempModelName][imageType][dimsIndex].inPixel.height,
                });
            })
            .catch((err) => console.log(err));
    }

    const handleSelectStyle = (index) => {
        setStyleSelectedIndex(index);
        let tempModelName = categoryStyles[index].modelName;
        setModelName(tempModelName);
        const dimsIndex = global_data.modelsDimentions[tempModelName][imageType].findIndex((el) => el.inCm == dimentionsInCm);
        setDimentions({
            width: global_data.modelsDimentions[tempModelName][imageType][dimsIndex].inPixel.width,
            height: global_data.modelsDimentions[tempModelName][imageType][dimsIndex].inPixel.height,
        });
    }

    const handleSelectImageType = (imgType) => {
        setImageType(imgType);
        switch (imgType) {
            case "horizontal": {
                setDimentionsInCm("70x50");
                setDimentions({
                    width: 896,
                    height: 640,
                });
                break;
            }
            case "vertical": {
                setDimentionsInCm("50x70");
                setDimentions({
                    width: 640,
                    height: 896,
                });
                break;
            }
            case "square": {
                setDimentionsInCm("30x30");
                setDimentions({
                    width: 768,
                    height: 768,
                });
                break;
            }
            default: {
                console.log("error in select image position");
            }
        }
    }

    const generatedImageWithAI = (e) => {
        e.preventDefault();
        setErrorMsg("");
        setIsWaitStatus(true);
        Axios.get(
            `${process.env.BASE_API_URL}/text-to-image/generate-image?textPrompt=${textPrompt}&prompt=${categoryStyles[styleSelectedIndex].prompt}&category=${categoriesData[categorySelectedIndex].name}&model_name=${modelName}&negative_prompt=${categoryStyles[styleSelectedIndex].negative_prompt}&width=${dimentions.width}&height=${dimentions.height}
        `)
            .then((res) => {
                let result = res.data;
                console.log(result)
                setIsWaitStatus(false);
                if (Array.isArray(result)) {
                    setTempModelName(modelName);
                    setPaintingURL(result[0]);
                    setTempImageType(imageType);
                    setTempDimentionsInCm(dimentionsInCm);
                    setErrorMsg("");
                } else {
                    setErrorMsg("Something Went Wrong !!");
                }
            })
            .catch((err) => {
                console.log(err);
                setErrorMsg("Sorry, Something Went Wrong !!");
            });
    }

    return (
        // Start Text To Image Service Page
        <div className="text-to-image-service">
            <Head>
                <title>Tavlorify Store - Text To Image</title>
            </Head>
            <Header />
            {/* Start Page Content */}
            <div className="page-content">
                {/* Start Container */}
                <div className="container-fluid pt-4 pb-4">
                    <h1 className="text-center mb-5 welcome-msg pb-3">Welcome To You In Text To Image AI Service</h1>
                    {/* Start Grid System */}
                    <div className="row align-items-center">
                        {/* Start Column */}
                        <div className="col-md-6">
                            {/* Start Art Painting Section */}
                            <section
                                className="art-painting d-flex justify-content-center align-items-center"
                                style={isWaitStatus ? { backgroundColor: "#989492" } : {}}
                            >
                                <div className="canvas-image-box">
                                    <img
                                        src={paintingURL}
                                        className="canvas-image"
                                        alt="canvas image"
                                        width={`${global_data.appearedImageSizesForTextToImage["canvas"][tempImageType][tempDimentionsInCm].width}px`}
                                        height={`${global_data.appearedImageSizesForTextToImage["canvas"][tempImageType][tempDimentionsInCm].height}px`}
                                    />
                                </div>
                                {isWaitStatus && !errorMsg && <span className="loader"></span>}
                                {errorMsg && <p className="alert alert-danger">{errorMsg}</p>}
                            </section>
                            {/* End Art Painting Section */}
                        </div>
                        {/* End Column */}
                        {/* Start Column */}
                        <div className="col-md-6">
                            <section className="art-painting-options pe-3">
                                {/* Start Generating Image Options Section */}
                                <section className="generating-image-options">
                                    <h6 className="text-center mb-3 fw-bold">Your Text Prompt</h6>
                                    <textarea
                                        type="text"
                                        placeholder="a dog riding a bicycle"
                                        className="form-control mb-3 text-prompt"
                                        onChange={(e) => setTextPrompt(e.target.value)}
                                        defaultValue={textPrompt}
                                    ></textarea>
                                    <div className="row align-items-center">
                                        <div className="col-md-7">
                                            <h6 className="describe text-start mb-0 fw-bold">Describe what you want the AI to create .</h6>
                                        </div>
                                        <div className="col-md-5 text-end">
                                            {!isWaitStatus && !errorMsg &&
                                                <button className="btn btn-dark w-100" onClick={generatedImageWithAI}>Create</button>
                                            }
                                            {isWaitStatus && <button className="btn btn-dark w-50" disabled>Creating ...</button>}
                                        </div>
                                    </div>
                                    <hr />
                                    <h6 className="mb-4 fw-bold">Please Select Category</h6>
                                    {/* Start Categories Section */}
                                    <section className="categories mb-4">
                                        <div className="row">
                                            {categoriesData.map((category, index) => (
                                                <div className="col-md-2" key={category._id}>
                                                    {/* Start Category Box */}
                                                    <div
                                                        className="category-box text-center"
                                                        onClick={() => handleSelectCategory(index)}
                                                    >
                                                        <img
                                                            src={`${process.env.BASE_API_URL}/${category.imgSrc}`}
                                                            alt={category.name}
                                                            className="category-image mb-2"
                                                            style={index === categorySelectedIndex ? { border: "4px solid #000" } : {}}
                                                        />
                                                        <h6 className="category-name text-center">{category.name}</h6>
                                                    </div>
                                                    {/* End Category Box */}
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                    {/* End Categories Section */}
                                    <hr />
                                    <h6 className="mb-4 fw-bold">Please Select Style</h6>
                                    {/* Start Styles Section */}
                                    <section className="styles mb-3">
                                        {/* Start Grid System */}
                                        <div className="row">
                                            {/* Start Column */}
                                            {categoryStyles.map((style, index) => (
                                                <div className="col-md-2" key={index}>
                                                    {/* Start Style Box */}
                                                    <div
                                                        className="style-box p-2 text-center"
                                                        onClick={() => handleSelectStyle(index)}
                                                    >
                                                        <img
                                                            src={`${process.env.BASE_API_URL}/${style.imgSrc}`}
                                                            alt="aa" className="mb-2 style-image"
                                                            style={index === styleSelectedIndex ? { border: "4px solid #000" } : {}}
                                                        />
                                                        <p className="style-name m-0 text-center">{style.name}</p>
                                                    </div>
                                                    {/* End Style Box */}
                                                </div>
                                            ))}
                                            {/* End Column */}
                                        </div>
                                        {/* End Grid System */}
                                    </section>
                                    {/* End Styles Section */}
                                </section>
                                {/* Start Generating Image Options Section */}
                                {/* Start Displaying Art Painting Options Section */}
                                <section className="displaying-art-painting-options">
                                    <h5 className="fw-bold">Positions</h5>
                                    {/* Start Positions List */}
                                    <ul className="positions-list mb-4 text-center">
                                        <li
                                            className="p-3"
                                            style={imageType === "vertical" ? { border: "4px solid #000", fontWeight: "bold" } : {}}
                                            onClick={() => handleSelectImageType("vertical")}
                                        >
                                            Vertical
                                        </li>
                                        <li
                                            className="p-3"
                                            style={imageType === "horizontal" ? { border: "4px solid #000", fontWeight: "bold" } : {}}
                                            onClick={() => handleSelectImageType("horizontal")}
                                        >
                                            Horizontal
                                        </li>
                                        <li
                                            className="p-3"
                                            style={imageType === "square" ? { border: "4px solid #000", fontWeight: "bold" } : {}}
                                            onClick={() => handleSelectImageType("square")}
                                        >
                                            Square
                                        </li>
                                    </ul>
                                    {/* End Positions List */}
                                    <h5 className="fw-bold">Sizes</h5>
                                    {/* Start Sizes List */}
                                    <ul className="sizes-list mb-4 text-center">
                                        {global_data.gelatoDimetions["canvas"][imageType].map((dims, index) => (
                                            <li
                                                key={index}
                                                className="p-3"
                                                style={dims.inCm === dimentionsInCm ? { border: "4px solid #000", fontWeight: "bold" } : { lineHeight: "57px" }}
                                            >
                                                <h6 className="fw-bold">Popular</h6>
                                                {dims.inCm}
                                            </li>
                                        ))}
                                    </ul>
                                    {/* End Sizes List */}
                                </section>
                                {/* End Displaying Art Painting Options Section */}
                            </section>
                        </div>
                        {/* End Column */}
                    </div>
                    {/* End Grid System */}
                </div>
                {/* End Container */}
            </div>
            {/* End Page Content */}
        </div>
        // End Text To Image Service Page
    );
}

export default TextToImage;