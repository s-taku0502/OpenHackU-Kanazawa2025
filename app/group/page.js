"use client";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  collection,
  addDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function GroupPage() {
  const [groupName, setGroupName] = useState("");
  const [joinGroupId, setJoinGroupId] = useState("");
  const [user, setUser] = useState(null);
  const [userGroups, setUserGroups] = useState([]);
  const [appliedGroupId, setAppliedGroupId] = useState("");
  const [message, setMessage] = useState("");
  const auth = getAuth();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (userData.applying_groupId) {
            setAppliedGroupId(userData.applying_groupId);
          }
          if (userData.groupIds) {
            const groupIds = userData.groupIds;
            const groupsData = await Promise.all(
              groupIds.map(async (id) => {
                const groupDocRef = doc(db, "groups", id);
                const groupDocSnap = await getDoc(groupDocRef);
                return groupDocSnap.exists()
                  ? { id: groupDocSnap.id, ...groupDocSnap.data() }
                  : null;
              })
            );
            setUserGroups(groupsData.filter((group) => group !== null));
          }
        }
      } else {
        router.push("/signin");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!user || !groupName.trim()) {
      setMessage("グループ名を入力してください。");
      return;
    }
    try {
      const groupDocRef = await addDoc(collection(db, "groups"), {
        name: groupName,
        memberUids: [user.uid],
      });
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        groupIds: arrayUnion(groupDocRef.id),
        applying_groupId: groupDocRef.id,
      });
      setMessage(`グループ「${groupName}」を作成しました！`);
      setGroupName("");
      const newUserGroups = [...userGroups, { id: groupDocRef.id, name: groupName }];
      setUserGroups(newUserGroups);
      setAppliedGroupId(groupDocRef.id);
    } catch (error) {
      console.error("グループ作成エラー:", error);
      setMessage(`グループの作成に失敗しました: ${error.message}`);
    }
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    if (!user || !joinGroupId.trim()) {
      setMessage("グループIDを入力してください。");
      return;
    }
    try {
      const groupDocRef = doc(db, "groups", joinGroupId);
      const groupDocSnap = await getDoc(groupDocRef);
      if (!groupDocSnap.exists()) {
        setMessage("指定されたグループは存在しません。");
        return;
      }

      const groupData = groupDocSnap.data();

      await updateDoc(groupDocRef, {
        memberUids: arrayUnion(user.uid),
      });
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        groupIds: arrayUnion(joinGroupId),
        applying_groupId: joinGroupId,
      });

      setMessage(`グループに参加しました！`);
      setJoinGroupId("");
      if (!userGroups.some(group => group.id === joinGroupId)) {
        const newUserGroups = [...userGroups, { id: joinGroupId, ...groupData }];
        setUserGroups(newUserGroups);
      }
      setAppliedGroupId(joinGroupId);
    } catch (error) {
      console.error("グループ参加エラー:", error);
      setMessage(`グループへの参加に失敗しました: ${error.message}`);
    }
  };

  const handleApplyGroup = async (groupId) => {
    if (!user) return;
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        applying_groupId: groupId,
      });
      setAppliedGroupId(groupId);
      setMessage(`グループを適用しました。`);
    } catch (error) {
      console.error("グループ適用エラー:", error);
      setMessage(`グループの適用に失敗しました: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>グループページ</h1>
      {message && <p style={{ color: "green" }}>{message}</p>}

      <section style={{ marginTop: "2rem" }}>
        <h2>参加中のグループ</h2>
        {userGroups.length > 0 ? (
          <ul>
            {userGroups.map((group) => (
              <li key={group.id}>
                {group.name} (ID: {group.id})
                {appliedGroupId === group.id ? (
                  <span style={{ marginLeft: "10px", color: "blue" }}>
                    (適用中)
                  </span>
                ) : (
                  <button
                    onClick={() => handleApplyGroup(group.id)}
                    style={{ marginLeft: "10px" }}
                  >
                    適用
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>参加しているグループはありません。</p>
        )}
      </section>

      <section>
        <h2>新しいグループを作成</h2>
        <form onSubmit={handleCreateGroup}>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="新しいグループ名"
            required
          />
          <button type="submit">作成</button>
        </form>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>既存のグループに参加</h2>
        <form onSubmit={handleJoinGroup}>
          <input
            type="text"
            value={joinGroupId}
            onChange={(e) => setJoinGroupId(e.target.value)}
            placeholder="グループID"
            required
          />
          <button type="submit">参加</button>
        </form>
      </section>
    </div>
  );
}
