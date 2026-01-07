'use client';

import { PatientNote, getPatientNotes, deletePatientNote, addPatientNote } from '@/services/headerServices';
import { useState, useEffect } from 'react';

interface NotesModalProps {
    isOpen: boolean;
    onClose: () => void;
    ordsrvnro: string;
    onNotesUpdate?: () => void;
}

export default function NotesModal({ isOpen, onClose, ordsrvnro, onNotesUpdate }: NotesModalProps) {
    const [notes, setNotes] = useState<PatientNote[]>([]);
    const [loading, setLoading] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        if (isOpen && ordsrvnro) {
            loadNotes();
        }
    }, [isOpen, ordsrvnro]);

    const loadNotes = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('gam_access_token') || '';
            const data = await getPatientNotes(token, ordsrvnro);
            setNotes(data);
        } catch (error) {
            console.error('Error loading notes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (noteId: number) => {
        try {
            const token = localStorage.getItem('gam_access_token') || '';
            await deletePatientNote(token, ordsrvnro, noteId);
            const updatedNotes = notes.filter(n => n.id !== noteId);
            setNotes(updatedNotes);
            if (onNotesUpdate) onNotesUpdate();
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const handleAddNote = async () => {
        if (!newNote.trim()) return;
        setAdding(true);
        try {
            const token = localStorage.getItem('gam_access_token') || '';
            await addPatientNote(token, ordsrvnro, newNote);
            setNewNote('');
            loadNotes();
            if (onNotesUpdate) onNotesUpdate();
        } catch (error) {
            console.error('Error adding note:', error);
        } finally {
            setAdding(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>

            <div className="bg-white w-full max-w-[800px] rounded-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 relative z-10 font-sans">

                {/* Header */}
                <div className="bg-[#005F61] p-4 flex items-center justify-between text-white relative">
                    <h2 className="text-lg font-bold text-center w-full">Notas del usuario</h2>
                    <button onClick={onClose} className="absolute right-4 hover:opacity-80 transition-opacity">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-6 bg-slate-50">
                    {/* Notes List */}
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-6">
                        <div className="bg-[#005F61] text-white px-6 py-3 grid grid-cols-[150px_1fr_50px] font-bold text-sm">
                            <div>Fecha</div>
                            <div>Nota</div>
                            <div></div>
                        </div>

                        <div className="max-h-[300px] overflow-y-auto">
                            {loading ? (
                                <div className="p-8 flex justify-center">
                                    <div className="w-6 h-6 border-2 border-slate-200 border-b-[#005F61] rounded-full animate-spin"></div>
                                </div>
                            ) : notes.length === 0 ? (
                                <div className="p-8 text-center text-slate-500 italic">No hay notas registradas.</div>
                            ) : (
                                notes.map((note) => (
                                    <div key={note.id} className="px-6 py-4 grid grid-cols-[150px_1fr_50px] border-b border-slate-100 last:border-0 items-center hover:bg-slate-50 transition-colors">
                                        <div className="font-bold text-slate-900 text-sm">{note.fecha}</div>
                                        <div className="text-slate-800 text-sm font-bold">{note.nota}</div>
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => handleDelete(note.id)}
                                                className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                                                title="Eliminar nota"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Add Note Section */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-900 block">Anotación</label>
                        <textarea
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder='Ingrese anotación sobre el usuario" por " Las notas que se ingresen en este componente son de carácter privado, sólo serán visibles por usted, y no quedarán registrados en el documento clínico'
                            className="w-full h-32 p-4 border border-[#005F61] rounded-lg bg-[#EAF6F8] text-slate-600 text-sm italic focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none placeholder:text-slate-400"
                        />
                    </div>

                    <div className="flex justify-center mt-6">
                        <button
                            onClick={handleAddNote}
                            disabled={adding || !newNote.trim()}
                            className="bg-[#005F61] hover:bg-[#004d4f] text-white font-bold py-2 px-8 rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {adding ? 'Agregando...' : 'Agregar Nota'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
