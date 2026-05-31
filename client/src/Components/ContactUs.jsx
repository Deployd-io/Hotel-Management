import React from 'react'
import { useState } from 'react'
import axios from 'axios'
const logger = console;
import { useDispatch } from 'react-redux';
import { showSnakbar } from '../store/slices/snakbar';

const ContactUs = () => {
logger.debug('>>> Entering ContactUs()');

  const dispatch = useDispatch();
  const [name, setName] = useState('');
logger.debug(`ContactUs: email → ****`);
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
	logger.debug(`>>> Entering handleSubmit(e=${e})`); const _start = Date.now();
    e.preventDefault();
    try {
      const response = await axios.post('/contact', {
        name,
        email,
        number,
        message
      });
      if (response.status === 201) {
		const _start = Date.now();
        dispatch(
          showSnakbar({
            message: `Message sent  successfully!`,
            open: true,
            type: 'success',
          })
        );
      }
      setName('');
	logger.info(`ContactUs(): API call took ${Date.now() - _start} ms`);
      setEmail('');
	logger.info(`handleSubmit(e=${e}): API call took ${Date.now() - _start} ms`);
      setNumber('');
      setMessage('');
    } catch (err) {
      console.log(err)
      dispatch(
        showSnakbar({
          message: `${err.response.message}`,
          open: true,
          type: 'success',
        })
      );
      setName('');
      setEmail('');
      setNumber('');
      setMessage('');
    }

logger.debug(`<<< Exiting handleSubmit(e=${e})`);
  };

  const handleReset = () => {
	logger.debug('>>> Entering handleReset()');
    setName('');
    setEmail('');
    setNumber('');
    setMessage('');
	logger.debug('<<< Exiting handleReset()');
  };

logger.debug('<<< Exiting ContactUs()');
  return (
    <>
      <div>
        <div className="container mt-4">
          <h1 className="text-center mb-4 h1">Contact Us</h1>
          <form>
            <div className="form-group mt-3">
              <label htmlFor="name">Name:</label>
              <input type="text" className="form-control" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="email">Email:</label>
              <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} name="email" required />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="mobile">Mobile Number:</label>
              <input type="tel" className="form-control" id="mobile" value={number} onChange={(e) => setNumber(e.target.value)} name="mobile" required />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="message">Message:</label>
              <textarea className="form-control" id="message" name="message" value={message} onChange={(e) => setMessage(e.target.value)} rows="4" required></textarea>
            </div>
            <button type="submit" onClick={handleSubmit} className="btn bg-primary text-light mr-2 mt-3">Submit</button>
            <button type="reset" onClick={handleReset} className="btn bg-primary text-light ml-2 mt-3">Reset</button>
          </form>
        </div>
      </div>
    </>)
}

export default ContactUs
