import { useState, useEffect } from "react";
import api from '../../services/api'

function Dashboard() {
    const [stats, setStats] = useState({ orders: 0, revenue: 0, customers: 0, products: 0})
    const [recentOrders, setRecentOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() =>{
        const fetchData= async () =>{
            try{
                const res = await api.get('/orders/admin/stats')
                setStats({
                    orders: res.data.stats.totalOrders,
                    revenue: res.data.stats.revenue,
                    customers: res.data.stats.totalCustomers,
                    products: res.data.stats.totalProducts
                })
                setRecentOrders(res.data.recentOrders)
            }catch(err){
                console.log(err)
            }finally{
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-700',
        confirmed: 'bg-blue-100 text-blue-700',
        processing: 'bg-purple-100 text-purple-700',
        shipped: 'bg-indigo-100 text-indigo-700',
        delivered: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
        returned: 'bg-stone-100 text-stone-700'
    }

    return(
        <div>
            <h1 className="text-xl font-light tracking-[0.2em] uppercase text-stone-800 mb-8">Dashboard</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <div className="bg-white border border-stone-200 p-5 rounded">
                    <p className="text-xs tracking-widest uppercase text-stone-400 mb-2">Total Orders</p>
                    <p className="text-2xl text-stone-800 font-light">{stats.orders}</p>
                </div>
                <div className="bg-white border border-stone-200 p-5 rounded">
                    <p className="text-xs tracking-widest uppercase text-stone-400 mb-2">Revenue (recent)</p>
                    <p className="text-2xl text-stone-800 font-light">₹{stats.revenue}</p>
                </div>
                <div className="bg-white border border-stone-200 p-5 rounded">
                    <p className="text-xs tracking-widest uppercase text-stone-400 mb-2">Total Products</p>
                    <p className="text-2xl text-stone-800 font-light">{stats.products}</p>
                </div>
                <div className="bg-white border border-stone-200 p-5 rounded">
                    <p className="text-xs tracking-widest uppercase text-stone-400 mb-2">Total Customers</p>
                    <p className="text-2xl text-stone-800 font-light">{stats.customers}</p>
                </div>
            </div>
            <div className="bg-white border border-stone-200 rounded p-6">
                <h2 className="text-xs tracking-widest uppercase text-stone-700 font-medium mb-5">Recent Orders</h2>

                {loading && <p className="text-xs tracking-widest uppercase text-stone-400">Loading...</p>}

                {!loading && (
                    <div className="">
                        {recentOrders.map(order =>(
                            <div key={order._id} className="flex justify-between items-center border-b border-stone-100 pb-3">
                                <div>
                                    <p className="text-xs text-stone-800 font-mono">{order._id.slice(-8)}</p>
                                    <p className="text-xs text-stone-400 mt-1">{order.user?.name} · {new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`text-xs tracking-widest uppercase px-3 py-1 rounded-full ${statusColors[order.orderStatus]}`}>
                                        {order.orderStatus}
                                    </span>    
                                    <p className="text-sm text-stone-800 font-medium">₹{order.total}</p>
                                </div>
                            </div>        
                        ))}
                    </div>    
                )}
            </div>
        </div>
    )
}

export default Dashboard