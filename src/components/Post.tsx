import { format, formatDistanceToNow } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'   
import { FormEvent, useState, ChangeEvent, InvalidEvent } from 'react'

import { Avatar } from './Avatar'
import { Comments } from './Comments'

import styles from './Post.module.css'

interface Author {
    name: string
    role: string
    avatarUrl: string
}

interface Content {
    type: string
    content: string
}

interface PostProps {
    author: Author
    publishedAt: Date
    content: Content[]
}

export function Post ({ author, publishedAt, content }: PostProps) {
    const  [comments, setComments] = useState([
        'ficou pica dmsss!!'
    ])

    const [newCommentText, setNewCommentText] = useState('')

    console.log(newCommentText)

    const publishedDateFormatted = format(publishedAt, "d 'de' LLLL 'às' HH:mm'h'", {
        locale: ptBR
    }) 

    const publishedDateRelativeToNow = formatDistanceToNow(publishedAt, {
        locale: ptBR,
        addSuffix: true
    })

    function handleCreateNewComment(event: FormEvent) {
        event.preventDefault()
        
        setComments([...comments, newCommentText])
        setNewCommentText('')
    }

    function handleNewCommentChange(event: ChangeEvent<HTMLTextAreaElement>) {
        event.target.setCustomValidity('')
        setNewCommentText(event.target.value)
    }

    function handleNewCommentInvalid(event: InvalidEvent<HTMLTextAreaElement>) {
        event.target.setCustomValidity('Esse campo é obrigatório!')
    }

    function deleteComment(commentToDelete: string) {
        const commentsWithouDeletedOne = comments.filter(comment => {
            return comment != commentToDelete
        })
        setComments(commentsWithouDeletedOne)
    }

    const isNewCommentEmpty = newCommentText.length === 0

    return (    
        <article className={styles.post}> {/* cabeçalho */}
            <header>    
                <div className={styles.author}>
                        <Avatar src={author.avatarUrl} />

                    <div className={styles.authorInfo}>
                        <strong>{author.name}</strong>
                        <span>{author.role}</span>
                    </div>
                </div>

                <time title={publishedDateFormatted} dateTime={publishedAt.toISOString()}>
                    {publishedDateRelativeToNow}`
                </time>
            </header>{/* cabeçalho */}


            <div className={styles.content}>{/* conteudo */}
                {content.map(line => {
                    if(line.type === 'paragraph') {
                        return <p key={line.content} >{line.content}</p>
                    }else if (line.type === 'Link') {
                        return <p key={line.content} ><a href="#">{line.content}</a></p>
                    }
                })}
            </div>
            {/* conteudo */}

            <form onSubmit={handleCreateNewComment} className={styles.commentForm}>
                <strong>Deixe seu feedback</strong>

                <textarea
                    name="comment"
                    value={newCommentText}
                    placeholder="Deixe um comentário"
                    onChange={handleNewCommentChange}
                    onInvalid={handleNewCommentInvalid}
                    required
                />
                <footer>
                    <button type="submit" disabled={isNewCommentEmpty}>
                        Publicar
                    </button>
                </footer>
            </form>

            <div className={styles.commentList}>
                {comments.map(comment => {
                    return(
                        <Comments 
                            key={comment} 
                            content={comment} 
                            onDeleteComment={deleteComment} 
                        />
                    )
                })}
            </div>    

        </article>
    )
}
