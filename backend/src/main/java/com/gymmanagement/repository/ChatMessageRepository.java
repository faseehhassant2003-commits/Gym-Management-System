package com.gymmanagement.repository;

import com.gymmanagement.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage,Long> {
    List<ChatMessage> findByMemberIdOrderByCreatedAtAsc(Long memberId);
    void deleteByMemberId(Long memberId);

}
