import React, { useState } from 'react';
import classes from './upload.module.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AiOutlineFileImage } from 'react-icons/ai';

const Upload = () => {
    const [state, setState] = useState({});
    const [firstImg, setFirstImg] = useState(null);
    const [secondImg, setSecondImg] = useState(null);
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const handleState = (e) => {
        setState((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();

        try {
            let firstImgFilename = null;
            let secondImgFilename = null;

            if (firstImg && secondImg) {
                const formData1 = new FormData();
                firstImgFilename = crypto.randomUUID() + firstImg.name;
                formData1.append('filename', firstImgFilename);
                formData1.append('image', firstImg);

                const formData2 = new FormData();
                secondImgFilename = crypto.randomUUID() + secondImg.name;
                formData2.append('filename', secondImgFilename);
                formData2.append('image', secondImg);

                await Promise.all([
                    fetch(`http://localhost:5000/upload/image`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        method: 'POST',
                        body: formData1,
                    }),
                    fetch(`http://localhost:5000/upload/image`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        method: 'POST',
                        body: formData2,
                    }),
                ]);
            }

            const res = await fetch(`http://localhost:5000/post`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                method: 'POST',
                body: JSON.stringify({
                    ...state,
                    firstImg: firstImgFilename,
                    secondImg: secondImgFilename,
                }),
            });
            const data = await res.json();
            console.log(data);
            navigate('/');
        } catch (error) {
            alert(error);
        }
    };

    console.log(state);
    return (
        <div className={classes.container}>
            <div className={classes.wrapper}>
                <h2>Upload Post</h2>
                <form onSubmit={handleCreatePost}>
                    <input type="text" name="desc" placeholder="Description..." onChange={handleState} />
                    <label htmlFor="firstImg">Upload first photo <AiOutlineFileImage /></label>
                    <input type="file" id="firstImg" style={{display: 'none'}} onChange={(e) => setFirstImg(e.target.files[0])} />
                    <label htmlFor="secondImg">Upload second photo <AiOutlineFileImage /></label>
                    <input type="file" id="secondImg" style={{display: 'none'}} onChange={(e) => setSecondImg(e.target.files[0])} />
                    <button>Submit</button>
                </form>
            </div>
        </div>
    );
};

export default Upload;
