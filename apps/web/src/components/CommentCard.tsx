import React from 'react'
import SurfaceBlock from './UI/SurfaceBlock'
import styles from "./CommentCard.module.css"
import StarIcon from "@/assets/icons/star-solid-full.svg?react"

interface CommentCardProps {
    name: string
    rating: number
    date: string
    comment: string
    profilePicture: string
}

const CommentCard = ({name, rating, date, comment, profilePicture}: CommentCardProps) => {

  return (
    <div className={styles.card}>
        <div className={styles.row}>
            <img src={profilePicture} alt="" />
            <div>
                <h2>{name}</h2>
                <p>{date}</p>
            </div>
        </div>
        <div className={styles.row}>
            {/* <p>{rating}</p> */}
            {Array.from({ length: rating }, (_, i) => (
                <StarIcon className={styles.icon} key={i} />
            ))}
            
        </div>
        <p className={styles.commentSection}>{comment}</p>
    </div>
  )
}

export default CommentCard