import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { getBookings, updateBooking, cancelBooking } from "../lib/store";
import { Booking } from "../lib/types";
import { EXHIBITION_DATES } from "../lib/constants";
import { Download, Calendar as CalendarIcon, List, Search, Trash2, Edit2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "../lib/utils";

export function Admin() {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [bookings, setBookings] = useState<Booking[]>(getBookings());
  const [filter, setFilter] = useState("");

  const refresh = () => setBookings(getBookings());

  const handleCancel = (id: string) => {
    if (window.confirm("Delete this booking?")) {
      cancelBooking(id);
      refresh();
    }
  };

  const handleExport = () => {
    const headers = ["ID", "Name", "Email", "Company", "Country", "Product", "Inquiry Type", "Date", "Time", "Message"];
    const rows = bookings.map(b => [
      b.id, b.name, b.email, b.companyName, b.country, b.productInterest, b.inquiryType, b.date, b.time, `"${b.message || ""}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "whx_bookings.csv");
    document.body.appendChild(link);
    link.click();
  };

  const filteredBookings = bookings.filter(b => 
    b.companyName.toLowerCase().includes(filter.toLowerCase()) ||
    b.name.toLowerCase().includes(filter.toLowerCase()) ||
    b.email.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-2">Admin Dashboard</h1>
            <p className="text-slate-400">Manage reservations and schedules.</p>
          </div>
          <div className="flex gap-4">
            <button onClick={handleExport} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/20 transition-all text-sm font-bold">
              <Download className="w-4 h-4" /> Export Excel
            </button>
          </div>
        </div>

        <div className="glass rounded-2xl overflow-hidden border border-white/10">
          <div className="p-6 border-b border-white/10 flex flex-col md:flex-row gap-6 justify-between bg-white/5">
            <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
              <button
                onClick={() => setView("calendar")}
                className={cn("px-6 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all", view === "calendar" ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:text-white")}
              >
                <CalendarIcon className="w-4 h-4" /> Calendar
              </button>
              <button
                onClick={() => setView("list")}
                className={cn("px-6 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all", view === "list" ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:text-white")}
              >
                <List className="w-4 h-4" /> List View
              </button>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400 w-full md:w-72 transition-colors placeholder:text-slate-600"
              />
            </div>
          </div>

          {view === "list" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-white/5 text-slate-400 font-medium border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Company</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredBookings.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">No bookings found.</td></tr>
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{format(parseISO(booking.date), "MMM d, yyyy")}</div>
                          <div className="text-slate-500 text-xs mt-1">{booking.time}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-300">{booking.companyName}</td>
                        <td className="px-6 py-4">
                          <div className="text-white">{booking.name}</div>
                          <div className="text-slate-500 text-xs">{booking.email}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-300">
                          <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
                            {booking.productInterest}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                            title="Delete Booking"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {EXHIBITION_DATES.map(date => {
                const dayBookings = filteredBookings.filter(b => b.date === date).sort((a, b) => a.time.localeCompare(b.time));
                return (
                  <div key={date} className="bg-white/5 rounded-xl border border-white/10 p-4">
                    <h3 className="font-bold text-white mb-4 pb-2 border-b border-white/10 flex items-center justify-between">
                      {format(parseISO(date), "EEEE, MMM d")}
                      <span className="text-xs font-normal text-slate-500 bg-black/40 px-2 py-1 rounded-full">{dayBookings.length} slots</span>
                    </h3>
                    <div className="space-y-3">
                      {dayBookings.length === 0 ? (
                        <p className="text-xs text-slate-600 italic py-2">No bookings yet</p>
                      ) : (
                        dayBookings.map(b => (
                          <div key={b.id} className="p-3 bg-black/40 rounded-lg border border-white/5 hover:border-cyan-500/30 transition-colors group">
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-cyan-400 font-mono text-xs font-bold">{b.time}</span>
                              <button onClick={() => handleCancel(b.id)} className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="font-medium text-white text-sm truncate">{b.companyName}</div>
                            <div className="text-slate-500 text-xs truncate">{b.name}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}