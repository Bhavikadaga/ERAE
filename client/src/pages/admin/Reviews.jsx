import { useState, useEffect } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'

function Reviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const res = await api.get('/reviews/admin/all')
      setReviews(res.data.reviews || [])
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return
    try {
      await api.delete(`/reviews/${id}`)
      toast.success('Review deleted')
      fetchReviews()
    } catch (err) {
      toast.error('Something went wrong')
    }
  }

  return (
    <div>
      <h1 className="text-xl font-light tracking-[0.2em] uppercase text-stone-800 mb-8">Reviews</h1>

      {loading ? (
        <p className="text-xs tracking-widest uppercase text-stone-400">Loading...</p>
      ) : (
        <div className="bg-white border border-stone-200 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-left">
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Customer</th>
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Product</th>
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Rating</th>
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Comment</th>
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Date</th>
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(review => (
                <tr key={review._id} className="border-b border-stone-100">
                  <td className="p-4 text-stone-700">{review.user?.name}</td>
                  <td className="p-4 text-stone-500 text-xs">{review.product?.name}</td>
                  <td className="p-4 text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</td>
                  <td className="p-4 text-stone-600 text-xs max-w-xs truncate">{review.comment}</td>
                  <td className="p-4 text-xs text-stone-400">{new Date(review.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <button onClick={() => handleDelete(review._id)}
                      className="text-xs tracking-widest uppercase text-red-500 hover:text-red-700">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reviews.length === 0 && (
            <p className="text-center py-10 text-xs tracking-widest uppercase text-stone-400">No reviews yet</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Reviews