import { Card } from 'react-bootstrap';
import './Box.css';

const Box = ({ title, text, link }) => {
  return (
    <Card className="w-100 custom-card">
      <Card.Body>
        <Card.Title className="card-title">{title}</Card.Title>
        <Card.Text className="card-text">{text}</Card.Text>
        <a className='btn' href={link}>Ver más</a>
      </Card.Body>
    </Card>
  );
};

export default Box;
