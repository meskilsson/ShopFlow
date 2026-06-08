import React, { useState } from 'react'
import Card from '@/components/UI/Card'
import Styles from './SellerInfo.module.css'
import { useAuth } from '@/contexts/AuthContext'
import { updateUserRequest } from '@/api/user'

const SellerInfo = () => {
    const { user, updateAuthUser } = useAuth()
    const [editing, setEditing] = useState(false)
    const [draft, setDraft] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const displayName = user?.storeName || user?.name || ''

    const beginEdit = () => {
        setDraft(displayName)
        setError(null)
        setEditing(true)
    }

    const handleSave = async () => {
        const trimmed = draft.trim()
        if (!trimmed || trimmed === displayName) {
            setEditing(false)
            return
        }
        setIsSaving(true)
        setError(null)
        try {
            await updateUserRequest(user!._id, { storeName: trimmed })
            updateAuthUser({ ...user!, storeName: trimmed })
            setEditing(false)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save')
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        setEditing(false)
        setError(null)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSave()
        if (e.key === 'Escape') handleCancel()
    }

    return (
        <Card fullWidth>
            <div className={Styles.content}>
                <div className={Styles.avatar}>
                    {displayName.charAt(0).toUpperCase()}
                </div>
                <div className={Styles.info}>
                    <p className={Styles.welcomeText}>Welcome back</p>
                    {editing ? (
                        <div className={Styles.editRow}>
                            <input
                                className={Styles.input}
                                value={draft}
                                onChange={e => setDraft(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                disabled={isSaving}
                            />
                            <button className={Styles.btnSave} onClick={handleSave} disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                            <button className={Styles.btnCancel} onClick={handleCancel} disabled={isSaving}>Cancel</button>
                        </div>
                    ) : (
                        <div className={Styles.nameRow}>
                            <h2 className={Styles.storeName}>{displayName}</h2>
                            <button className={Styles.editBtn} onClick={beginEdit} title="Edit store name">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                                Edit name
                            </button>
                        </div>
                    )}
                    {error && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{error}</p>}
                    <p className={Styles.subText}>Manage your store, products, and sales from here.</p>
                </div>
            </div>
        </Card>
    )
}

export default SellerInfo
