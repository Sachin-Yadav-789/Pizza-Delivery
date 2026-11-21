import { useEffect, useState } from 'react'
import './List.css'
import axios from 'axios';
import { toast } from 'react-toastify';


const List = ({url}) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchList = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success && Array.isArray(response.data.data)) {
        setList(response.data.data);
      } else {
        throw new Error(response.data.message || 'Could not load food items.');
      }
    } catch (requestError) {
      console.error('Failed to fetch food list:', requestError);
      const message = 'Could not load food items. Make sure the backend and database are running.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  const removeFood = async(foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message || 'Could not remove food item.');
      }
    } catch (requestError) {
      console.error('Failed to remove food item:', requestError);
      toast.error('Could not remove food item.');
    }
  }


  useEffect(() => {
    let isCurrent = true;
    axios.get(`${url}/api/food/list`)
      .then((response) => {
        if (!isCurrent) return;
        if (response.data.success && Array.isArray(response.data.data)) {
          setList(response.data.data);
          setError('');
        } else {
          throw new Error(response.data.message || 'Could not load food items.');
        }
      })
      .catch((requestError) => {
        if (!isCurrent) return;
        console.error('Failed to fetch food list:', requestError);
        const message = 'Could not load food items. Make sure the backend and database are running.';
        setError(message);
        toast.error(message);
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [url]);
 
  return (
    <div className='list add flex-col'>
       <p>All Food List</p>
       <div className="list-table">
         <div className="list-table-format title">
             <b>Image</b>
             <b>Name</b>
             <b>Category</b>
             <b>Price</b>
             <b>Action</b>
         </div>
          {loading ? (
            <p>Loading food items...</p>
          ) : error ? (
            <div>
              <p>{error}</p>
              <button type="button" onClick={() => {
                setLoading(true);
                setError('');
                fetchList();
              }}>Retry</button>
            </div>
          ) : list.length === 0 ? (
            <p>No food items found. Add an item to see it here.</p>
          ) : (
            list.map((item) => (
              <div key={item._id} className='list-table-format'>
                <img src={`${url}/images/${item.image}`} alt={item.name} />
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>&#8377;{item.price}</p>
                <p onClick={() => removeFood(item._id)} className='cursor'>X</p>
              </div>
            ))
          )}
       </div>
      
    </div>
  )
}

export default List
